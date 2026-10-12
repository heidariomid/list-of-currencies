import Image from 'next/image';
import {CurrencyListProps} from '../../interfaces/ICurrencyInfo';
import {formatNumber} from '../../utils/formatNumber';

const TBodyCurrencies = ({currency}: CurrencyListProps) => {
	const orderStatusStyle = (change: number) => {
		let bgColor;
		if (change > 0) {
			bgColor = ' text-green-500';
		} else if (change < 0) {
			bgColor = 'text-red-500';
		} else {
			bgColor = 'text-gray-800';
		}
		return bgColor;
	};
	return (
		<tbody className='bg-white divide-y divide-gray-200 dark:bg-ocean dark:divide-gray-700 '>
			{currency?.id && (
				<tr key={currency.id}>
					<td className='pl-6  text-sm text-gray-500 dark:text-zinc-400'>{currency.market_cap_rank}</td>
					<td className='px-2 py-4 whitespace-nowrap'>
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
					<td className='px-6 py-4 whitespace-nowrap'>
						<div className='text-sm text-gray-900 dark:text-white'>
							{formatNumber(currency?.current_price, 'usdWithCents')}
						</div>
					</td>
					<td className='px-6 py-4 whitespace-nowrap '>
						<div className='flex'>
							{currency.price_change_24h < 0 ? (
								<svg className='h-4 w-4 text-red-500 ' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg' stroke='#ff0000' strokeWidth='2'>
									<path d='M6 9l6 6 6-6' />
								</svg>
							) : (
								<svg className='h-4 w-4 text-green-500 ' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg' stroke='#00d600' strokeWidth='2'>
									<path d='M18 15l-6-6-6 6' />
								</svg>
							)}
							<span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${orderStatusStyle(currency.price_change_percentage_24h)} `}>
								{formatNumber(currency?.price_change_percentage_24h, 'percent')}
							</span>
						</div>
					</td>
					<td className='px-6 py-4 whitespace-nowrap '>
						<div className='flex'>
							{currency.price_change_percentage_7d_in_currency < 0 ? (
								<svg className='h-4 w-4 text-red-500 ' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg' stroke='#ff0000' strokeWidth='2'>
									<path d='M6 9l6 6 6-6' />
								</svg>
							) : (
								<svg className='h-4 w-4 text-green-500 ' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg' stroke='#00d600' strokeWidth='2'>
									<path d='M18 15l-6-6-6 6' />
								</svg>
							)}
							<span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${orderStatusStyle(currency.price_change_percentage_7d_in_currency)}`}>
								{formatNumber(currency?.price_change_percentage_7d_in_currency, 'percent')}
							</span>
						</div>
					</td>
					<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-white'>
						{formatNumber(currency?.market_cap, 'usdWhole')}
					</td>
					<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-white'>
						{formatNumber(currency?.total_volume, 'usdWhole')}
					</td>
					<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-white text-right '>
						{formatNumber(currency?.circulating_supply, 'whole')}
						<span className='text-gray-400 ml-2 uppercase'>{currency.symbol}</span>
					</td>
				</tr>
			)}
		</tbody>
	);
};

export default TBodyCurrencies;
