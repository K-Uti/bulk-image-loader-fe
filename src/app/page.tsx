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
import { UploadCloud, FileArchive, CheckCircle2, Loader2 } from 'lucide-react';

export default function UploadPage() {
	const [isUploading, setIsUploading] = useState(false);
	const [uploadStep, setUploadStep] = useState<
		'idle' | 'uploading' | 'processing' | 'success'
	>('idle');
	const [progress, setProgress] = useState(0);

	console.log(progress);

	// Имитация процесса асинхронной обработки
	const handleStartSimulate = () => {
		setIsUploading(true);
		setUploadStep('uploading');
		setProgress(10);

		// Этап 1: Загрузка на S3
		setTimeout(() => {
			setProgress(40);
			setUploadStep('processing');

			// Этап 2: Работа воркера (распаковка и сохранение)
			const interval = setInterval(() => {
				setProgress(prev => {
					if (prev >= 100) {
						clearInterval(interval);
						setUploadStep('success');
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
						onClick={handleStartSimulate}
						disabled={isUploading}
						className='bg-emerald-600 hover:bg-emerald-500 text-white font-medium'
					>
						{isUploading ? 'Loading...' : 'Select the archive'}
					</Button>
				</CardContent>
			</Card>

			{/* Process indicator (RabbitMQ / Kafka stream) */}
			{uploadStep !== 'idle' && (
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
								ID: task_usr_99a1
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
