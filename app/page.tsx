import Currencies from '../components/Lists/Currencies';
import Header from '../components/Header/Header';

export default function Home() {
	return (
		<div className='dark:bg-ocean h-full md:h-screen w-full '>
			<main>
				<Header />
				<Currencies />
			</main>
		</div>
	);
}
