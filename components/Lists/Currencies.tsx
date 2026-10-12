'use client';

import {useQuery} from '@tanstack/react-query';
import axios from 'axios';
import {ICurrencyInfo} from '../../interfaces/ICurrencyInfo';
import Skeleton from '../Loading/Skeleton';
import Pagination from '../Pagination/Pagination';
import TBodyCurrencies from './TBodyCurrencies';
import THeadCurrencies from './THeadCurrencies';
import {Paginator} from '../../services/Paginator';
import ErrorBoundry from '../Error/ErrorBoundry';
import {fetchCurrencies} from '../../FetcherApi/fetchCurrencyAPI';
import {useListParams} from '../../hooks/useListParams';
import {sortCurrencies} from '../../utils/sortCurrencies';

const FIVE_MINUTES = 5 * 60 * 1000;
const PER_PAGE = 10;

const Currencies = () => {
	const {page, q, sort, dir, setPage, setSort} = useListParams();

	const {
		data: allCurrencies,
		isPending,
		isError,
		error,
	} = useQuery({
		queryKey: ['currencies'],
		queryFn: fetchCurrencies,
		staleTime: FIVE_MINUTES,
		refetchOnWindowFocus: false,
		retry: (failureCount, error) => {
			if (axios.isAxiosError(error) && error.response?.status === 429) return false;
			return failureCount < 2;
		},
	});

	const term = q.trim().toLowerCase();
	const filtered = term
		? allCurrencies?.filter((currency: ICurrencyInfo) => currency.name.toLowerCase().includes(term) || currency.symbol.toLowerCase().includes(term))
		: allCurrencies;
	const message = term && filtered?.length === 0 ? 'No Result Found' : '';
	const sorted = filtered ? sortCurrencies(filtered, sort, dir) : undefined;
	const currencies: ICurrencyInfo[] | undefined = sorted?.length ? Paginator(sorted, page, PER_PAGE).data : undefined;
	const totalPageItems = sorted?.length ?? 0;

	if (isPending) {
		return (
			<div className='w-full min-w-0 pt-6'>
				<Skeleton />
			</div>
		);
	}
	if (isError) {
		const reason = axios.isAxiosError(error) && error.response?.status === 429 ? 'rate-limit' : 'generic';
		return <ErrorBoundry reason={reason} />;
	}

	return (
		<>
			<section className='min-w-0 py-6 md:py-8'>
				{currencies && !message && (
					<div className='max-h-[min(65vh,calc(100dvh-16rem))] w-full min-w-0 max-w-full overflow-auto rounded-lg border border-gray-200 shadow-sm dark:border-zinc-600'>
						<table className='w-max min-w-full divide-y-[1px] divide-gray-200 dark:divide-zinc-700'>
							<THeadCurrencies sort={sort} dir={dir} onSort={setSort} />
							<tbody>
								{currencies.map((currency: ICurrencyInfo) => {
									return <TBodyCurrencies key={currency.id} currency={currency} />;
								})}
							</tbody>
						</table>
					</div>
				)}
				{message && <p className='text-center text-lg pt-16 text-zinc-600 dark:text-zinc-300'>{message}</p>}
			</section>
			<section className='min-w-0'>
				{currencies && !message && (
					<Pagination total={totalPageItems} perPage={PER_PAGE} currentPage={page} setCurrentPage={setPage} isPlaceholderData={false} />
				)}
			</section>
		</>
	);
};

export default Currencies;
