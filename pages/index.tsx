import Head from 'next/head';
import {dehydrate, QueryClient, useQuery} from 'react-query';
import axios from 'axios';
import Currencies from '../components/Lists/Currencies';

const Home = () => {
	return (
		<>
			<Head>
				<title>List of Currencies</title>
				<meta name='description' content='showing list of digital currencies' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<main>
				<h1 className='font-bold  text-center p-2 text-xl mt-10 mb-5 bg-black text-white'>List of Currencies</h1>
				<Currencies />
			</main>
		</>
	);
};

// getStaticProps to fetch data on server side
export async function getStaticProps() {
	const queryClient = new QueryClient();
	await queryClient.prefetchQuery('currencies', async () => {
		const {data} = await axios.get('https://api.coingecko.com/api/v3/simple/supported_vs_currencies');
		return data;
	});
	return {
		props: {
			dehydratedState: dehydrate(queryClient),
		},
	};
}

export default Home;
