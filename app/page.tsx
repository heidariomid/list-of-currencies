import {Suspense} from 'react';
import Currencies from '../components/Lists/Currencies';
import Header from '../components/Header/Header';

export default function Home() {
	return (
		<div className='min-h-dvh w-full bg-white dark:bg-ocean'>
			<main className='mx-auto w-full min-w-0 max-w-screen-xl px-4 py-6 md:px-10 md:py-10'>
				<Suspense>
					<Header />
					<Currencies />
				</Suspense>
			</main>
		</div>
	);
}
