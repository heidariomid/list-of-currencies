import {useCallback, useEffect, useState} from 'react';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {CurrencyListProps, ICurrencyInfo} from '../../interfaces/ICurrencyInfo';
import {allMockedCurrencies, fetchAllCurrencies, fetchCurrencies, mockedCurrencies} from '../../FetcherApi/axios';
import Countdown from 'react-countdown';
import Skeleton from '../Loading/Skeleton';
import Pagination from '../Pagination/Pagination';
import TBodyCurrencies from './TBodyCurrencies';
import THeadCurrencies from './THeadCurrencies';
import {useStateValue} from '../../store/context/ContextManager';
import {Paginator} from '../../services/Paginator';
const Currencies = () => {
	const queryClient = useQueryClient();
	const [page, setPage] = useState<number>(1);
	const [perPage, setPerPage] = useState<number>(10);
	const [totalPageItems, setTotalPageItems] = useState<number>(70);
	const [message, setMessage] = useState<string | undefined>('');
	const [checkLoading, setCheckLoading] = useState<string | undefined>('');
	const [state] = useStateValue();

	// mocked all currencies
	// const {data: allCurrencies} = useQuery(['mockedAllCurrencies'], allMockedCurrencies);

	// useQuery to fetch all currencies
	const {data: allCurrencies, isLoading: isAllCurrenciesLoading} = useQuery(['allCurrencies'], fetchAllCurrencies, {
		staleTime: 5000,
		// enabled: state?.currency?.query !== null && state?.currency?.query !== '',
	});

	// useQuery to fetch data length
	// const {data: allCurrencies, isLoading: isFetchAllCurrenciesLoading} = useQuery(['allCurrencies'], fetchAllCurrencies, {
	// 	staleTime: 5000,
	// 	enabled: state?.currency?.query !== null,
	// });

	// handle search
	const handleSearch = useCallback(
		(data: any) => {
			if (allCurrencies) {
				const filteredCurrencies = allCurrencies?.filter(
					(currency: any) =>
						currency.name.toLowerCase().includes(state?.currency?.query?.toLowerCase()) ||
						currency.symbol.toLowerCase().includes(state?.currency?.query?.toLowerCase()),
				);
				if (state?.currency?.query === 'empty') {
					if (totalPageItems !== allCurrencies.length) {
						setTotalPageItems(allCurrencies.length);
						if (page !== 1) {
							setPage(1);
						}
					}
					if (message !== '') {
						setMessage('');
					}

					return data;
				}
				if (filteredCurrencies.length > 0) {
					if (message !== '') {
						setMessage('');
					}

					const {data: paginateData, totalItem} = Paginator(filteredCurrencies, page, perPage);
					if (totalPageItems !== totalItem) {
						setTotalPageItems(totalItem);
						if (state?.currency?.query !== '' && page !== 1) {
							setPage(1);
						}
					}
					return paginateData;
				}
				if (filteredCurrencies.length === 0) {
					setTotalPageItems(0);
					setMessage('No Result Found');
				}
			}
		},
		[page, state?.currency?.query],
	);
	// useQuery to fetch data
	const {
		data: currencies,
		isLoading,
		isError,
		isPreviousData,
	} = useQuery<ICurrencyInfo[]>(['currencies', page], () => fetchCurrencies(page, perPage), {
		staleTime: 5000,
		keepPreviousData: true,
		select: state?.currency?.query === '' || state?.currency?.query === null ? undefined : handleSearch,
	});
	// prefetch next page data
	useEffect(() => {
		if (!isPreviousData && !isLoading) {
			console.log('preFetch next page');
			const nextPage = page + 1;
			queryClient.prefetchQuery(['currencies', nextPage], () => fetchCurrencies(nextPage, perPage), {
				staleTime: 5000,
			});
		}
	}, [page, queryClient]);
	// check if data is loading
	if (isLoading) {
		return (
			<div className='flex flex-col max-w-screen-md md:max-w-screen-xl mx-auto pt-10 '>
				<Skeleton />
			</div>
		);
	}
	// if (state?.currency?.query && isAllCurrenciesLoading) {
	// 	<div className='flex flex-col max-w-screen-md md:max-w-screen-xl mx-auto pt-10 '>
	// 		<span>loading...</span> <Skeleton />
	// 	</div>;
	// }
	// check if there is an error

	if (isError) {
		const Completionist = () => (
			<>
				<span>You are good to go!</span>
				<span>Please refresh the page</span>
			</>
		);
		return (
			<div className='relative mt-10'>
				<div
					role='status'
					className='relative p-4 space-y-4 w-full  rounded border border-gray-200 divide-y divide-gray-200 shadow animate-pulse dark:divide-gray-700 md:p-6 dark:border-gray-700'
				>
					<div className='flex flex-col justify-between items-center'>
						<h1 className='uppercase font-bold'>your api key has limited request per minute </h1>
						<h3 className='uppercase text-gray-600'>please wait for a minute </h3>
						<Countdown date={Date.now() + 60000}>
							<Completionist />
						</Countdown>
					</div>
				</div>
				,
			</div>
		);
	}

	return (
		<>
			<section className='p-10 '>
				{currencies && !message && (
					<div className='flex flex-col max-w-screen-sm md:max-w-screen-xl mx-auto md:h-[70vh] '>
						<div className='-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
							<div className='py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8'>
								<div className='shadow overflow-hidden  border-[1px] border-gray-200 dark:border-zinc-600 sm:rounded-lg'>
									<table className='min-w-full divide-y-[1px] divide-gray-200 dark:divide-zinc-700 '>
										<THeadCurrencies />
										{currencies &&
											currencies?.map((currency: ICurrencyInfo, index: number) => {
												return <TBodyCurrencies key={index} currency={currency} />;
											})}
									</table>
								</div>
							</div>
						</div>
					</div>
				)}
				{message && (
					<div className='text-center text-xl pt-16 flex justify-center items-center'>
						<span className='bg-red-200 px-4 py-2 rounded-full  dark:bg-red-500'> {message}</span>
					</div>
				)}
				{checkLoading && <Skeleton />}
			</section>

			<section className='mt-10 h-32 '>
				{currencies && !message && <Pagination total={totalPageItems} perPage={perPage} currentPage={page} setCurrentPage={setPage} isPreviousData={isPreviousData} />}
			</section>
		</>
	);
};

export default Currencies;
