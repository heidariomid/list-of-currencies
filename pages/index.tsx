import Head from 'next/head';
import {dehydrate, QueryClient, useQuery} from 'react-query';
import axios from 'axios';
import Currencies from '../components/Lists/Currencies';
import Pagination from '../components/Pagination/Pagination';
import Header from '../components/Header/Header';
import {fetchCurrencies} from '../services/axios';
import {useState} from 'react';

const Home = () => {
	const [newCurrencies, setNewCurrencies] = useState([]);
	return (
		<div className='dark:bg-ocean h-screen w-full '>
			<Head>
				<title>Cryptocurrency</title>
				<meta name='description' content='showing list of digital currencies' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<main>
				<Header setNewCurrencies={setNewCurrencies} />
				<Currencies newCurrencies={newCurrencies} />
			</main>
		</div>
	);
};

// getStaticProps to fetch data on server side
export async function getStaticProps() {
	const queryClient = new QueryClient();
	await queryClient.prefetchQuery(['currencies'], () => fetchCurrencies(1, 10));
	return {
		props: {
			dehydratedState: dehydrate(queryClient),
		},
	};
}

export default Home;
