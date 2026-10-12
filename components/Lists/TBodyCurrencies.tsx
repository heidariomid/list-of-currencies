'use client';

import Link from 'next/link';
import {useRouter} from 'next/navigation';
import type {MouseEvent} from 'react';
import CoinLogo from '../Coin/CoinLogo';
import {CurrencyListProps} from '../../interfaces/ICurrencyInfo';
import {formatNumber, formatUsd} from '../../utils/formatNumber';

const changeClass = (change: number) => {
	if (change > 0) return 'text-green-500';
	if (change < 0) return 'text-red-500';
	return 'text-gray-500 dark:text-zinc-400';
};

const ChangeCell = ({change}: {change: number}) => {
	return (
		<div className='flex items-center'>
			{change < 0 ? (
				<svg className='h-4 w-4 text-red-500' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg' stroke='#ff0000' strokeWidth='2' aria-hidden='true'>
					<path d='M6 9l6 6 6-6' />
				</svg>
			) : change > 0 ? (
				<svg className='h-4 w-4 text-green-500' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg' stroke='#00d600' strokeWidth='2' aria-hidden='true'>
					<path d='M18 15l-6-6-6 6' />
				</svg>
			) : null}
			<span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${changeClass(change)}`}>
				{formatNumber(change, 'percent')}
			</span>
		</div>
	);
};

const TBodyCurrencies = ({currency, rank}: CurrencyListProps & {rank: number}) => {
	const router = useRouter();
	if (!currency?.id) return null;
	const href = `/coin/${currency.id}`;
	const openCoin = (event: MouseEvent<HTMLTableRowElement>) => {
		if (event.button !== 0) return;
		if (event.target instanceof Element && event.target.closest('a')) return;
		if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
			window.open(href, '_blank', 'noopener,noreferrer');
			return;
		}
		router.push(href);
	};

	return (
		<tr
			key={currency.id}
			onClick={openCoin}
			onAuxClick={(event) => {
				if (event.button !== 1) return;
				if (event.target instanceof Element && event.target.closest('a')) return;
				window.open(href, '_blank', 'noopener,noreferrer');
			}}
			className='group cursor-pointer bg-white border-b border-gray-200 hover:bg-gray-50 dark:bg-ocean dark:border-gray-700 dark:hover:bg-zinc-700'
		>
			<td className='px-4 py-3 text-sm text-gray-500 dark:text-zinc-400'>{rank}</td>
			<td className='px-12 py-3 whitespace-nowrap'>
				<Link href={href} prefetch={false} onClick={(event) => event.stopPropagation()} className='flex items-center'>
					<CoinLogo symbol={currency.symbol} />
					<div className='ml-4'>
						<div className='text-sm font-medium text-gray-900 group-hover:text-primary dark:text-white'>{currency.name}</div>
						<div className='text-sm font-medium text-gray-500 dark:text-zinc-400 uppercase'>{currency.symbol}</div>
					</div>
				</Link>
			</td>
			<td className='px-6 py-3 whitespace-nowrap tabular-nums'>
				<div className='text-sm text-gray-900 dark:text-white'>{formatUsd(currency.current_price)}</div>
			</td>
			<td className='px-10 py-3 whitespace-nowrap tabular-nums'>
				<ChangeCell change={currency.price_change_percentage_24h} />
			</td>
			<td className='px-6 py-3 whitespace-nowrap text-sm text-gray-500 tabular-nums dark:text-white'>{formatNumber(currency.total_volume, 'usdWhole')}</td>
			<td className='px-6 py-3 whitespace-nowrap text-sm text-gray-500 tabular-nums dark:text-white'>{formatUsd(currency.high_24h)}</td>
			<td className='px-6 py-3 whitespace-nowrap text-sm text-gray-500 tabular-nums dark:text-white'>{formatUsd(currency.low_24h)}</td>
		</tr>
	);
};

export default TBodyCurrencies;
