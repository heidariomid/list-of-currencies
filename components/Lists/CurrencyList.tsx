import {CurrencyListProps} from '../../interfaces/ICurrencyInfo';
import CurrencyFormat from 'react-currency-format';

const CurrencyList = ({currency, totalCurrency}: CurrencyListProps) => {
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
		<tbody className='bg-white divide-y divide-gray-200'>
			{currency?.id && (
				<tr key={currency.id}>
					{/*  show number of currencies from 1 to totalCurrency length */}
					<td className='pl-6  whitespace-nowrap text-sm text-gray-500'>{totalCurrency + 1}</td>

					<td className='px-6 py-4 whitespace-nowrap'>
						<div className='flex items-center'>
							<div className='flex-shrink-0 h-10 w-10'>
								<img className='h-10 w-10 rounded-full' src={currency.image} alt='' />
							</div>
							<div className='ml-4'>
								<div className='text-sm font-medium text-gray-900'>{currency.name}</div>
								<div className='text-sm font-medium text-gray-500 uppercase'>{currency.symbol}</div>
							</div>
						</div>
					</td>
					<td className='px-6 py-4 whitespace-nowrap'>
						<div className='text-sm text-gray-900'>
							<CurrencyFormat value={currency?.current_price?.toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} />
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
								<CurrencyFormat value={Math.abs(Number(currency?.price_change_percentage_24h?.toFixed(2)))} displayType={'text'} suffix={'%'} />
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
								<CurrencyFormat value={Math.abs(Number(currency?.price_change_percentage_7d_in_currency?.toFixed(2)))} displayType={'text'} suffix={'%'} />
							</span>
						</div>
					</td>

					<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
						<CurrencyFormat value={currency?.market_cap?.toFixed(0)} displayType={'text'} thousandSeparator={true} prefix={'$'} />
					</td>
					<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
						<CurrencyFormat value={currency?.total_volume?.toFixed(0)} displayType={'text'} thousandSeparator={true} prefix={'$'} />
					</td>
					<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right'>
						<CurrencyFormat value={currency?.circulating_supply?.toFixed(0)} displayType={'text'} thousandSeparator={true} />
						<span className='text-gray-400 ml-2 uppercase'>{currency.symbol}</span>
					</td>
				</tr>
			)}
		</tbody>
	);
};

export default CurrencyList;
