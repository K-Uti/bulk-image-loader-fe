import {
	S3Client,
	CreateBucketCommand,
	HeadBucketCommand,
} from '@aws-sdk/client-s3';

// Инициализируем S3 клиент для работы с MinIO
export const s3Client = new S3Client({
	endpoint: process.env.S3_ENDPOINT,
	region: process.env.S3_REGION,
	credentials: {
		accessKeyId: process.env.S3_ACCESS_KEY!,
		secretAccessKey: process.env.S3_SECRET_KEY!,
	},
	forcePathStyle: process.env.ENV === 'local' ? true : false, // for local MinIO
});

// check if bucket exists and create
export async function ensureBucketExists() {
	const bucketName = process.env.S3_BUCKET_NAME!;

	try {
		// check if exists
		await s3Client.send(new HeadBucketCommand({ Bucket: bucketName }));
	} catch (error) {
		const s3Error = error as {
			name?: string;
			$metadata?: { httpStatusCode?: number };
		};
		// if 404 (doesn't exist) create one
		if (
			s3Error.name === 'NotFound' ||
			s3Error.$metadata?.httpStatusCode === 404
		) {
			console.log(`[S3] Bucket "${bucketName}" not found. Creating...`);
			await s3Client.send(new CreateBucketCommand({ Bucket: bucketName }));
			console.log(`[S3] Bucket "${bucketName}" created`);
		} else {
			throw error;
		}
	}
}
