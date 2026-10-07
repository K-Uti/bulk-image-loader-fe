'use server';

import { db } from '@/db';
import { batches } from '@/db/schema';
import { revalidatePath } from 'next/cache';

// create new batch upload session
export async function createUploadBatch(fileName: string) {
	try {
		const [newBatch] = await db
			.insert(batches)
			.values({
				name: fileName,
				status: 'uploading',
				progress: 0,
				totalItems: 0, // we don't know how many files until we unpack it
			})
			.returning(); // return created row

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
