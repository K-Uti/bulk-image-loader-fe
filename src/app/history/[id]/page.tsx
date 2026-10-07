import React from 'react';
import Link from 'next/link';
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink, Image as ImageIcon } from 'lucide-react';

// uploaded images mock data
const mockImages = [
	{
		id: 1,
		title: 'Car 1',
		url: 'https://car1',
	},
	{
		id: 2,
		title: 'Car 2',
		url: 'https://car1',
	},
	{ id: 3, title: 'Car 3', url: 'https://car1' },
	{ id: 4, title: 'Car 4', url: 'https://car1' },
];

export default function BatchDetailsPage({
	params,
}: {
	params: { id: string };
}) {
	return (
		<div className='space-y-6'>
			<div className='flex items-center space-x-4'>
				<Link href='/history'>
					<Button
						variant='outline'
						size='icon'
						className='border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-zinc-100'
					>
						<ArrowLeft className='w-4 h-4' />
					</Button>
				</Link>
				<div>
					<div className='flex items-center space-x-2'>
						<h1 className='text-2xl font-bold tracking-tight'>Folder:</h1>
						<span className='text-xs px-2 py-0.5 font-mono rounded bg-zinc-800 text-zinc-400'>
							s3://auction-bucket/processed/
						</span>
					</div>
					<p className='text-zinc-400 text-sm mt-0.5'>
						Archive: retro_cars_vintage.zip
					</p>
				</div>
			</div>

			{/* Gallery */}
			<div className='grid gap-6 sm:grid-cols-2 md:grid-cols-4'>
				{mockImages.map(img => (
					<Card
						key={img.id}
						className='bg-zinc-900 border-zinc-800 overflow-hidden group'
					>
						<div className='relative aspect-video bg-zinc-950 flex items-center justify-center overflow-hidden'>
							{/* eslint-disable-next-line @next/next/no-img-element */}
							<img
								src={img.url}
								alt={img.title}
								className='object-cover w-full h-full group-hover:scale-105 transition-transform duration-300'
							/>
							<div className='absolute top-2 right-2 p-1.5 rounded bg-zinc-950/80 backdrop-blur border border-zinc-800 opacity-0 group-hover:opacity-100 transition-opacity'>
								<ExternalLink className='w-3.5 h-3.5 text-zinc-400' />
							</div>
						</div>
						<CardHeader className='p-4'>
							<CardTitle className='text-sm font-medium leading-none text-zinc-200'>
								{img.title}
							</CardTitle>
							<CardDescription className='text-xs text-zinc-500 mt-1.5 flex items-center'>
								<ImageIcon className='w-3 h-3 mr-1' /> s3_img_uuid_{img.id}.jpg
							</CardDescription>
						</CardHeader>
					</Card>
				))}
			</div>
		</div>
	);
}
