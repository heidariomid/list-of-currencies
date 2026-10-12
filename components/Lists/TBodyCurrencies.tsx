import Image from 'next/image';
import {CurrencyListProps} from '../../interfaces/ICurrencyInfo';
import {formatNumber} from '../../utils/formatNumber';

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

const TBodyCurrencies = ({currency}: CurrencyListProps) => {
	if (!currency?.id) return null;

	return (
		<tr key={currency.id} className='bg-white border-b border-gray-200 hover:bg-gray-50 dark:bg-ocean dark:border-gray-700 dark:hover:bg-zinc-700'>
			<td className='px-4 py-3 text-sm text-gray-500 dark:text-zinc-400'>{currency.market_cap_rank}</td>
			<td className='px-12 py-3 whitespace-nowrap'>
				<div className='flex items-center'>
					<div className='flex-shrink-0 h-10 w-10'>
						<Image className='h-10 w-10 rounded-full' src={currency.image} alt='' width={40} height={40} unoptimized />
					</div>
					<div className='ml-4'>
						<div className='text-sm font-medium text-gray-900 dark:text-white'>{currency.name}</div>
						<div className='text-sm font-medium text-gray-500 dark:text-zinc-400 uppercase'>{currency.symbol}</div>
					</div>
				</div>
			</td>
			<td className='px-6 py-3 whitespace-nowrap tabular-nums'>
				<div className='text-sm text-gray-900 dark:text-white'>{formatNumber(currency.current_price, 'usdWithCents')}</div>
			</td>
			<td className='px-10 py-3 whitespace-nowrap tabular-nums'>
				<ChangeCell change={currency.price_change_percentage_24h} />
			</td>
			<td className='px-10 py-3 whitespace-nowrap tabular-nums'>
				<ChangeCell change={currency.price_change_percentage_7d_in_currency} />
			</td>
			<td className='px-6 py-3 whitespace-nowrap text-sm text-gray-500 tabular-nums dark:text-white'>
				{formatNumber(currency.market_cap, 'usdWhole')}
			</td>
			<td className='px-6 py-3 whitespace-nowrap text-sm text-gray-500 tabular-nums dark:text-white'>
				{formatNumber(currency.total_volume, 'usdWhole')}
			</td>
			<td className='px-10 py-3 whitespace-nowrap text-sm text-gray-500 text-right tabular-nums dark:text-white'>
				{formatNumber(currency.circulating_supply, 'whole')}
				<span className='text-gray-400 ml-2 uppercase'>{currency.symbol}</span>
			</td>
		</tr>
	);
};

export default TBodyCurrencies;
