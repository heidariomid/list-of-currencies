import Link from 'next/link';
import ToggleBtn from '../../../components/Button/ToggleBtn';

export default function Loading() {
	return (
		<div className='min-h-dvh w-full bg-white dark:bg-ocean'>
			<main className='mx-auto w-full min-w-0 max-w-screen-xl px-4 py-6 md:px-10 md:py-10'>
				<div className='flex items-center justify-between gap-3'>
					<Link href='/' className='text-sm font-medium text-gray-500 dark:text-zinc-400'>
						← All prices
					</Link>
					<ToggleBtn />
				</div>
				<div role='status' className='mt-6 animate-pulse'>
					<span className='sr-only'>Loading coin</span>
					<div className='h-12 w-64 rounded bg-gray-200 dark:bg-zinc-700' />
					<div className='mt-6 h-10 w-48 rounded bg-gray-200 dark:bg-zinc-700' />
					<div className='mt-6 grid gap-4 lg:grid-cols-3'>
						<div className='aspect-[2/1] rounded-lg bg-gray-100 dark:bg-zinc-700 lg:col-span-2' />
						<div className='h-80 rounded-lg bg-gray-100 dark:bg-zinc-700' />
					</div>
				</div>
			</main>
		</div>
	);
}
