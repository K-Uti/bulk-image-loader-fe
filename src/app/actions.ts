'use server';

import { db } from '@/db';
import { batches, BatchStatus } from '@/db/schema';
import { revalidatePath } from 'next/cache';
import { s3Client, ensureBucketExists } from '@/lib/s3';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { eq } from 'drizzle-orm';

// create new batch upload session
export async function createUploadBatch(formData: FormData) {
	try {
		const file = formData.get('file') as File;
		if (!file) {
			return { success: false, error: "File wan't found" };
		}

		const [newBatch] = await db
			.insert(batches)
			.values({
				name: file.name,
				status: BatchStatus.UPLOADING,
				progress: 0,
				totalItems: 0, // we don't know how many files until we unpack it
			})
			.returning(); // return created row

		await ensureBucketExists();

		// making buffer from file to send to S3
		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);

		// path to file inside bucket
		const s3Key = `uploads/${newBatch.id}-${file.name}`;

		await s3Client.send(
			new PutObjectCommand({
				Bucket: process.env.S3_BUCKET_NAME!,
				Key: s3Key,
				Body: buffer,
				ContentType: file.type || 'application/zip',
			})
		);

		console.log(
			`[S3] File ${file.name} successfully loaded to bucket with key: ${s3Key}`
		);

		// setting status to processing
		await db
			.update(batches)
			.set({
				status: BatchStatus.PROCESSING,
				progress: 30,
			})
			.where(eq(batches.id, newBatch.id));

		// invalidate page so that new data appears
		revalidatePath('/history');

		return { success: true, batch: newBatch };
	} catch (error) {
		console.error('Error upon creating new batch:', error);
		return {
			success: false,
			error: 'Could not start creating a new batch',
		};
	}
}
