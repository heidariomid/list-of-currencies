import Head from 'next/head';
import {dehydrate, QueryClient, useQuery} from 'react-query';
import axios from 'axios';
import Currencies from '../components/Lists/Currencies';
import Pagination from '../components/Pagination/Pagination';
import ToggleBtn from '../components/Button/ToggleBtn';
import {useCurrentTheme} from '../hooks/useCurrentTheme';
import SearchBar from '../components/Search/SearchCrypto';

const Home = () => {
	const {currentTheme} = useCurrentTheme();
	const setCurrentPageHandler = () => {
		console.log('clicked');
	};
	return (
		<>
			<Head>
				<title>Cryptocurrency</title>
				<meta name='description' content='showing list of digital currencies' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<main>
				<div className='flex  mt-6 max-w-screen-md md:max-w-screen-xl  justify-between items-center mx-auto px-20'>
					<SearchBar />
					<h1 className={`  ${currentTheme === 'dark' ? 'text-white' : 'text-black'}   font-bold   mr-48 text-xl  `}>Cryptocurrency Prices</h1>

					<ToggleBtn />
				</div>
				<Currencies />
				<Pagination totalPages={4} currentPage={1} setCurrentPage={setCurrentPageHandler} />
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
