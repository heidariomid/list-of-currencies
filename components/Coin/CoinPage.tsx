'use client';

import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useState, type ReactNode} from 'react';
import {useQuery} from '@tanstack/react-query';
import ToggleBtn from '../Button/ToggleBtn';
import {fetchCoinChart, MarketsError} from '../../FetcherApi/fetchCurrencyAPI';
import type {CoinChart, CoinDetail} from '../../interfaces/ICoinDetail';
import type {ChartRange} from '../../utils/chartSeries';
import {formatCompactUsd, formatSignedPercent, formatUpdated, formatUsd} from '../../utils/formatNumber';
import CoinLogo from './CoinLogo';
import PriceChart from './PriceChart';

const FIVE_MINUTES = 5 * 60 * 1000;

export type CoinPageError = 'missing' | 'rate-limit' | 'generic';

type CoinPageProps = {
	id: string;
	coin: CoinDetail | null;
	error: CoinPageError | null;
	initialChart: CoinChart | null;
};

const tone = (value: number | null | undefined) => {
	if (value == null || !Number.isFinite(value) || value === 0) return 'text-gray-500 dark:text-zinc-400';
	return value > 0 ? 'text-green-500' : 'text-red-500';
};

function TopBar() {
	return (
		<div className='flex items-center justify-between gap-3'>
			<Link href='/' className='text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white'>
				← All prices
			</Link>
			<ToggleBtn />
		</div>
	);
}

function CoinError({error}: {error: CoinPageError}) {
	const router = useRouter();
	const title = error === 'missing' ? 'This coin is not available' : error === 'rate-limit' ? 'Too many requests' : 'The coin could not be loaded';
	const hint = error === 'missing' ? 'It may have been renamed or removed.' : error === 'rate-limit' ? 'Wait a minute, then try again.' : 'Try again in a moment.';

	return (
		<div role='alert' className='mt-8 rounded-lg border border-gray-200 bg-white px-6 py-8 text-center dark:border-zinc-600 dark:bg-ocean'>
			<p className='text-base font-medium text-gray-900 dark:text-white'>{title}</p>
			<p className='mt-2 text-sm text-gray-600 dark:text-zinc-400'>{hint}</p>
			{error !== 'missing' && (
				<button type='button' onClick={() => router.refresh()} className='mt-4 text-sm font-medium text-primary'>
					Try again
				</button>
			)}
		</div>
	);
}

function Stat({label, value, detail, detailClassName, children}: {label: string; value: string; detail?: string; detailClassName?: string; children?: ReactNode}) {
	return (
		<div className='border-b border-gray-200 py-3 last:border-b-0 dark:border-zinc-700'>
			<div className='flex items-start justify-between gap-3'>
				<dt className='text-sm text-gray-500 dark:text-zinc-400'>{label}</dt>
				<dd className='text-right'>
					<div className='text-sm font-medium tabular-nums text-gray-900 dark:text-white'>{value}</div>
					{detail && <div className={`mt-0.5 text-xs tabular-nums ${detailClassName ?? 'text-gray-500 dark:text-zinc-400'}`}>{detail}</div>}
				</dd>
			</div>
			{children}
		</div>
	);
}

function CoinDetailView({id, coin, initialChart}: {id: string; coin: CoinDetail; initialChart: CoinChart | null}) {
	const [range, setRange] = useState<ChartRange>('1');
	const seed = range === '1' ? initialChart : null;
	const chart = useQuery({
		queryKey: ['coin-chart', id, range],
		queryFn: () => fetchCoinChart(id, range, coin.symbol),
		initialData: seed ?? undefined,
		staleTime: FIVE_MINUTES,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
		retry: (failureCount, error) => {
			if (error instanceof MarketsError && (error.status === 429 || error.status === 404)) return false;
			return failureCount < 1;
		},
	});
	const chartError = chart.isError
		? chart.error instanceof MarketsError && chart.error.status === 429
			? 'rate-limit'
			: chart.error instanceof MarketsError && chart.error.status === 404
				? 'unavailable'
				: 'generic'
		: null;
	const points = chart.isError ? [] : (chart.data?.points ?? []);
	const rangePosition =
		coin.low24h != null && coin.high24h != null && coin.high24h > coin.low24h
			? Math.min(100, Math.max(0, ((coin.price - coin.low24h) / (coin.high24h - coin.low24h)) * 100))
			: null;

	return (
		<>
			<div className='mt-6 flex items-center gap-3'>
				<CoinLogo symbol={coin.symbol} size={48} />
				<div className='min-w-0'>
					<div className='flex flex-wrap items-center gap-2'>
						<h1 className='text-2xl font-semibold tracking-tight text-gray-900 dark:text-white md:text-3xl'>{coin.name}</h1>
						<span className='text-sm font-medium uppercase text-gray-500 dark:text-zinc-400'>{coin.symbol}</span>
						{coin.rank != null && (
							<span className='rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-zinc-700 dark:text-zinc-300'>Volume #{coin.rank}</span>
						)}
					</div>
				</div>
			</div>
			<div className='mt-5'>
				<p className='text-3xl font-semibold tabular-nums text-gray-900 dark:text-white md:text-4xl'>{formatUsd(coin.price)}</p>
				<p className={`mt-1 text-sm font-medium tabular-nums md:text-base ${tone(coin.change24h)}`}>
					{coin.change24hValue != null && <span>{formatUsd(coin.change24hValue)} </span>}
					<span>({formatSignedPercent(coin.change24h)})</span>
					<span className='ml-2 font-normal text-gray-500 dark:text-zinc-400'>24h</span>
				</p>
				{coin.lastUpdated && <p className='mt-2 text-xs text-gray-500 dark:text-zinc-400'>Updated {formatUpdated(coin.lastUpdated)}</p>}
			</div>
			<div className='mt-6 grid min-w-0 gap-4 lg:grid-cols-3'>
				<div className='min-w-0 lg:col-span-2'>
					<PriceChart
						name={coin.name}
						points={points}
						fallbackPrice={coin.price}
						range={range}
						onRange={setRange}
						loading={chart.isPending}
						error={chartError}
						onRetry={() => {
							void chart.refetch();
						}}
					/>
				</div>
				<aside className='h-fit rounded-lg border border-gray-200 bg-white px-4 shadow-sm dark:border-zinc-600 dark:bg-ocean'>
					<dl>
						<Stat label='Volume (24h)' value={formatCompactUsd(coin.volume)} />
						{rangePosition != null && coin.low24h != null && coin.high24h != null && (
							<div className='border-b border-gray-200 py-3 dark:border-zinc-700'>
								<div className='text-sm text-gray-500 dark:text-zinc-400'>24h range</div>
								<div
									role='meter'
									aria-label='24 hour price range'
									aria-valuemin={coin.low24h}
									aria-valuemax={coin.high24h}
									aria-valuenow={coin.price}
									className='relative mt-3 h-1.5 rounded-full bg-gray-200 dark:bg-zinc-700'
								>
									<span className='absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-gray-900 shadow dark:border-ocean' style={{left: `${rangePosition}%`}} />
								</div>
								<div className='mt-2 flex justify-between text-xs tabular-nums text-gray-500 dark:text-zinc-400'>
									<span>{formatUsd(coin.low24h)}</span>
									<span>{formatUsd(coin.high24h)}</span>
								</div>
							</div>
						)}
					</dl>
				</aside>
			</div>
		</>
	);
}

const CoinPage = ({id, coin, error, initialChart}: CoinPageProps) => {
	return (
		<>
			<TopBar />
			{coin && !error ? <CoinDetailView id={id} coin={coin} initialChart={initialChart} /> : <CoinError error={error ?? 'generic'} />}
		</>
	);
};

export default CoinPage;
