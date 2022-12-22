import {useState} from 'react';
import {QueryClient, useQuery} from 'react-query';
import {ICurrencyInfo} from '../../interfaces/ICurrencyInfo';
import {fetchCurrencies, fetchCurrenciesLength} from '../../services/axios';
import Skeleton from '../Loading/Skeleton';
import Pagination from '../Pagination/Pagination';
import TBodyCurrencies from './TBodyCurrencies';
import THeadCurrencies from './THeadCurrencies';
const Currencies = () => {
	const queryClient = new QueryClient();
	const [page, setPage] = useState<number>(1);
	const perPage = 10;
	// useQuery to fetch data length
	const {data: totalCurrency} = useQuery(['totalCurrency'], fetchCurrenciesLength);
	// useQuery to fetch data
	const {
		data: currencies,
		isLoading,
		isError,
		isFetching,
		isPreviousData,
	} = useQuery(['currencies', page], () => fetchCurrencies(page, perPage), {staleTime: 5000, keepPreviousData: true});

	// check if data is loading
	if (isLoading || isFetching) {
		return (
			<div className='flex flex-col max-w-screen-md md:max-w-screen-xl mx-auto pt-10 '>
				<Skeleton />
			</div>
		);
	}
	// check if there is an error
	if (isError) {
		return <div>Error...</div>;
	}

	return (
		<>
			<section className='p-10'>
				{currencies && !isFetching && (
					<div className='flex flex-col max-w-screen-md md:max-w-screen-xl mx-auto  '>
						<div className='-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
							<div className='py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8'>
								<div className='shadow overflow-hidden border-b border-gray-200 sm:rounded-lg'>
									<table className='min-w-full divide-y divide-gray-200'>
										<THeadCurrencies />
										{currencies &&
											currencies?.map((currency: ICurrencyInfo, index: number) => {
												return <TBodyCurrencies key={index} currency={currency} totalCurrency={index} />;
											})}
									</table>
								</div>
							</div>
						</div>
					</div>
				)}
			</section>

			{totalCurrency && <Pagination total={totalCurrency} perPage={perPage} currentPage={page} setCurrentPage={setPage} isPreviousData={isPreviousData} />}
		</>
	);
};

export default Currencies;
