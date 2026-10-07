import React from 'react';
import Link from 'next/link';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Calendar, HardDrive } from 'lucide-react';

// load history mock
const mockHistory = [
	{
		id: 'batch-001',
		name: 'retro_cars_vintage.zip',
		items: 48,
		size: '142 MB',
		status: 'success',
		date: '2026-10-06 14:22',
	},
	{
		id: 'batch-002',
		name: 'swiss_watches_collection.zip',
		items: 120,
		size: '389 MB',
		status: 'success',
		date: '2026-10-05 11:05',
	},
	{
		id: 'batch-003',
		name: 'damaged_archive_test.zip',
		items: 0,
		size: '12 MB',
		status: 'failed',
		date: '2026-10-04 18:40',
	},
];

export default function HistoryPage() {
	return (
		<div className='space-y-8'>
			<div>
				<h1 className='text-3xl font-bold tracking-tight'>Loads history</h1>
				<p className='text-zinc-400 mt-1'>List of all loads</p>
			</div>

			<Card className='bg-zinc-900 border-zinc-800'>
				<CardContent className='p-0'>
					<Table>
						<TableHeader className='bg-zinc-950/50'>
							<TableRow className='border-zinc-800 hover:bg-transparent'>
								<TableHead className='text-zinc-400'>Title</TableHead>
								<TableHead className='text-zinc-400'>
									<span className='flex items-center'>
										<Calendar className='w-3.5 h-3.5 mr-1' /> Date
									</span>
								</TableHead>
								<TableHead className='text-zinc-400'>Number of items</TableHead>
								<TableHead className='text-zinc-400'>
									<span className='flex items-center'>
										<HardDrive className='w-3.5 h-3.5 mr-1' /> Size
									</span>
								</TableHead>
								<TableHead className='text-zinc-400'>Status</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{mockHistory.map(batch => (
								<TableRow
									key={batch.id}
									className='border-zinc-800 hover:bg-zinc-900/50 transition-colors'
								>
									<TableCell className='font-medium text-zinc-200'>
										{batch.name}
									</TableCell>
									<TableCell className='text-zinc-400 font-mono text-xs'>
										{batch.date}
									</TableCell>
									<TableCell className='text-zinc-300 font-mono'>
										{batch.items}
									</TableCell>
									<TableCell className='text-zinc-400 font-mono text-xs'>
										{batch.size}
									</TableCell>
									<TableCell>
										{batch.status === 'success' ? (
											<Badge
												className='bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
												variant='outline'
											>
												Ok
											</Badge>
										) : (
											<Badge
												className='bg-rose-500/10 text-rose-400 border-rose-500/20'
												variant='outline'
											>
												Error
											</Badge>
										)}
									</TableCell>
									<TableCell className='text-right'>
										<Link href={`/history/${batch.id}`}>
											<Button
												size='sm'
												variant='ghost'
												className='h-8 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'
											>
												<Eye className='w-4 h-4 mr-1' /> Check upload
											</Button>
										</Link>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	);
}
