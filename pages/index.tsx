import Head from 'next/head';
import Currencies from '../components/Lists/Currencies';
import Header from '../components/Header/Header';

const Home = () => {
	return (
		<div className='dark:bg-ocean h-full md:h-screen w-full '>
			<Head>
				<title>Cryptocurrency</title>
				<meta name='description' content='showing list of digital currencies' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<main>
				<Header />
				<Currencies />
			</main>
		</div>
	);
};

export default Home;
