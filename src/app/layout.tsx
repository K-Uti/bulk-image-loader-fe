import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Bulk Image Loader',
	description: 'Async image load',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
	return (
		<html lang='en' className='h-full antialiased'>
			<body
				className={`${inter.className} min-h-screen bg-zinc-950 text-zinc-50 antialiased`}
			>
				{/* NAVIGATION */}
				<header className='border-b border-zinc-800 bg-zinc-900/50 backdrop-blur sticky top-0 z-50'>
					<div className='max-w-7xl mx-auto px-4 h-16 flex items-center justify-between'>
						<div className='flex items-center space-x-8'>
							<Link
								href='/'
								className='font-bold text-lg tracking-tight bg-linear-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent'
							>
								Image Loader
							</Link>
							<nav className='flex items-center space-x-6 text-sm font-medium text-zinc-400'>
								<Link
									href='/'
									className='hover:text-zinc-100 transition-colors'
								>
									Create
								</Link>
								<Link
									href='/history'
									className='hover:text-zinc-100 transition-colors'
								>
									History
								</Link>
							</nav>
						</div>
						<div className='flex items-center space-x-2'>
							<span className='w-2 h-2 rounded-full bg-emerald-500 animate-pulse' />
							<span className='text-xs text-zinc-400 font-mono'>
								Services: Online
							</span>
						</div>
					</div>
				</header>

				{/* Page content */}
				<div className='max-w-7xl mx-auto px-4 py-8'>{children}</div>
			</body>
		</html>
	);
}
