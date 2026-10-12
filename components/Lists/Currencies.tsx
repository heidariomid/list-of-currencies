'use client';

import {useEffect, useState} from 'react';
import {keepPreviousData, useQuery, useQueryClient} from '@tanstack/react-query';
import {ICurrencyInfo} from '../../interfaces/ICurrencyInfo';
import Skeleton from '../Loading/Skeleton';
import Pagination from '../Pagination/Pagination';
import TBodyCurrencies from './TBodyCurrencies';
import THeadCurrencies from './THeadCurrencies';
import {useStateValue} from '../../store/context/ContextManager';
import {Paginator} from '../../services/Paginator';
import ErrorBoundry from '../Error/ErrorBoundry';
import {fetchAllCurrencies, fetchCurrencies} from '../../FetcherApi/fetchCurrencyAPI';
const Currencies = () => {
	const queryClient = useQueryClient();
	const [page, setPage] = useState<number>(1);
	const [state] = useStateValue();
	const perPage: number = state?.currency?.perPage;
	const query: string | null = state?.currency?.query;

	// useQuery to fetch all currencies
	const {data: allCurrencies} = useQuery({
		queryKey: ['allCurrencies'],
		queryFn: fetchAllCurrencies,
		staleTime: 5000,
	});
	// useQuery to fetch data
	const {
		data: pageCurrencies,
		isPending,
		isError,
		isPlaceholderData,
	} = useQuery({
		queryKey: ['currencies', page],
		queryFn: () => fetchCurrencies(page, perPage),
		staleTime: 5000,
		placeholderData: keepPreviousData,
	});

	// handle search
	const isSearching = query !== null && query !== '' && query !== 'empty';
	const matches = isSearching
		? allCurrencies?.filter(
				(currency: ICurrencyInfo) => currency.name.toLowerCase().includes(query.toLowerCase()) || currency.symbol.toLowerCase().includes(query.toLowerCase()),
		  )
		: undefined;
	const message = matches?.length === 0 ? 'No Result Found' : '';
	const currencies: ICurrencyInfo[] | undefined = isSearching ? (matches?.length ? Paginator(matches, page, perPage).data : undefined) : pageCurrencies;
	const knownTotal = isSearching ? matches?.length : allCurrencies?.length;
	const totalPageItems = knownTotal ?? 0;

	// go back to the first page when a search changes the number of results
	const [lastTotal, setLastTotal] = useState<number | undefined>(undefined);
	if (knownTotal !== undefined && knownTotal !== lastTotal) {
		setLastTotal(knownTotal);
		if (lastTotal !== undefined && page !== 1) {
			setPage(1);
		}
	}

	// prefetch next page data
	useEffect(() => {
		if (!isPending) {
			const nextPage = page + 1;
			queryClient.prefetchQuery({
				queryKey: ['currencies', nextPage],
				queryFn: () => fetchCurrencies(nextPage, perPage),
				staleTime: 5000,
			});
		}
	}, [page, perPage, queryClient, isPending]);
	// check if data is loading
	if (isPending) {
		return (
			<div className='flex flex-col max-w-screen-md md:max-w-screen-xl mx-auto pt-10 '>
				<Skeleton />
			</div>
		);
	}
	// check if there is an error
	if (isError) {
		return <ErrorBoundry />;
	}

	return (
		<>
			<section className='p-10 '>
				{currencies && !message && (
					<div className='flex flex-col max-w-screen-sm md:max-w-screen-xl mx-auto md:h-[65vh] '>
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
			</section>
			<section className='h-32 '>
				{currencies && !message && (
					<Pagination total={totalPageItems} perPage={perPage} currentPage={page} setCurrentPage={setPage} isPlaceholderData={isPlaceholderData} />
				)}
			</section>
		</>
	);
};

export default Currencies;
