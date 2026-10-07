'use client';

import React, { useState } from 'react';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
	UploadCloud,
	FileArchive,
	CheckCircle2,
	Loader2,
	AlertCircle,
} from 'lucide-react';

import { createUploadBatch } from './actions';

enum UploadSteps {
	IDLE = 'idle',
	UPLOADING = 'uploading',
	PROCESSING = 'processing',
	SUCCESS = 'success',
	ERROR = 'error',
}

export default function UploadPage() {
	const [isUploading, setIsUploading] = useState(false);
	const [uploadStep, setUploadStep] = useState<UploadSteps>(UploadSteps.IDLE);
	const [progress, setProgress] = useState(0);
	const [batchId, setBatchId] = useState<string | null>(null);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const handleStartUpload = async () => {
		setIsUploading(true);
		setUploadStep(UploadSteps.UPLOADING);
		setProgress(5);
		setErrorMessage(null);

		const testFileName = 'items.zip';

		const result = await createUploadBatch(testFileName);

		if (!result.success || !result.batch) {
			setUploadStep(UploadSteps.ERROR);
			setErrorMessage(result.error || 'Something went wrong');
			setIsUploading(false);
			return;
		}

		setBatchId(result.batch.id);
		setProgress(30);

		// 1 stage: S3 archive upload
		setTimeout(() => {
			setProgress(40);
			setUploadStep(UploadSteps.PROCESSING);

			// 2 stage: worker jobs
			const interval = setInterval(() => {
				setProgress(prev => {
					if (prev >= 100) {
						clearInterval(interval);
						setUploadStep(UploadSteps.SUCCESS);
						setIsUploading(false);
						return 100;
					}
					return prev + 15;
				});
			}, 800);
		}, 1500);
	};

	return (
		<div className='max-w-3xl mx-auto space-y-8'>
			<div>
				<h1 className='text-3xl font-bold tracking-tight'>Bulk image upload</h1>
				<p className='text-zinc-400 mt-1'>
					Load ZIP-archive with images to be processed in the background
				</p>
			</div>

			{/* (Dropzone) */}
			<Card className='bg-zinc-900 border-zinc-500 border-dashed border-2 hover:border-zinc-200 transition-colors'>
				<CardContent className='flex flex-col items-center justify-center py-12 text-center'>
					<div className='p-4 bg-zinc-950 rounded-full border border-zinc-800 mb-4 text-zinc-400'>
						<UploadCloud className='w-10 h-10' />
					</div>
					<h3 className='font-semibold text-lg'>Drag your archive here</h3>
					<p className='text-sm text-zinc-500 max-w-xs mt-1 mb-6'>
						Titles of the files turned into object titles. Supported formats
						.jpg, .png.
					</p>
					<Button
						onClick={handleStartUpload}
						disabled={isUploading}
						className='bg-emerald-600 hover:bg-emerald-500 text-white font-medium'
					>
						{isUploading ? 'Loading...' : 'Select the archive'}
					</Button>
				</CardContent>
			</Card>

			{/* Error indicator */}
			{uploadStep === 'error' && (
				<Card className='bg-rose-950/20 border-rose-900/50 text-rose-400 p-4 flex items-center space-x-3'>
					<AlertCircle className='w-5 h-5 shrink-0' />
					<p className='text-sm'>{errorMessage}</p>
				</Card>
			)}

			{/* Process indicator (RabbitMQ / Kafka stream) */}
			{uploadStep !== 'idle' && uploadStep !== 'error' && (
				<Card className='bg-zinc-900 border-zinc-800'>
					<CardHeader>
						<div className='flex items-center justify-between'>
							<CardTitle className='text-base flex items-center space-x-2'>
								{uploadStep === 'uploading' && (
									<Loader2 className='w-4 h-4 animate-spin text-cyan-400' />
								)}
								{uploadStep === 'processing' && (
									<Loader2 className='w-4 h-4 animate-spin text-amber-400' />
								)}
								{uploadStep === 'success' && (
									<CheckCircle2 className='w-4 h-4 text-emerald-400' />
								)}
								<span>Status</span>
							</CardTitle>
							<Badge
								variant='outline'
								className='border-zinc-700 text-zinc-300 font-mono'
							>
								ID: {batchId ? batchId.slice(0, 8) + '...' : 'creating...'}
							</Badge>
						</div>
						<CardDescription>
							{uploadStep === 'uploading' && 'Loading archive into MinIO S3...'}
							{uploadStep === 'processing' && 'Processing files'}
							{uploadStep === 'success' && 'Done!'}
						</CardDescription>
					</CardHeader>
					<CardContent className='space-y-4'>
						<div className='flex justify-between text-sm font-mono text-zinc-400'>
							<span className='flex items-center'>
								<FileArchive className='w-4 h-4 mr-1.5 text-zinc-500' />{' '}
								car_parts_photos.zip
							</span>
							<span>{progress}%</span>
						</div>
						<Progress value={progress} />
					</CardContent>
				</Card>
			)}
		</div>
	);
}
