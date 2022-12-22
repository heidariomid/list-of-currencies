import {QueryClient, useQuery} from 'react-query';
import {ICurrencyInfo} from '../../interfaces/ICurrencyInfo';
import {fetchCurrencies} from '../../services/axios';
import Skeleton from '../Loading/Skeleton';
import CurrencyList from './CurrencyList';
const Currencies = () => {
	const queryClient = new QueryClient();
	// useQuery to fetch data
	const {data, isLoading, isError} = useQuery('currencies', fetchCurrencies, {staleTime: 5000});
	// check if data is loading
	if (isLoading) {
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
		<section className='p-10'>
			{data?.length > 0 && (
				<div className='flex flex-col max-w-screen-md md:max-w-screen-xl mx-auto  '>
					<div className='-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
						<div className='py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8'>
							<div className='shadow overflow-hidden border-b border-gray-200 sm:rounded-lg'>
								<table className='min-w-full divide-y divide-gray-200'>
									<thead className='bg-black text-white'>
										<tr>
											<th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-50 uppercase tracking-wider'>
												#
											</th>
											<th scope='col' className='px-12 py-3 text-left text-xs font-medium text-gray-50 uppercase tracking-wider'>
												COINS
											</th>
											<th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-50 uppercase tracking-wider'>
												PRICE
											</th>
											<th scope='col' className='px-10 py-3 text-left text-xs font-medium text-gray-50 uppercase tracking-wider'>
												24H
											</th>
											<th scope='col' className='px-10 py-3 text-left text-xs font-medium text-gray-50 uppercase tracking-wider'>
												7D
											</th>
											<th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-50 uppercase tracking-wider'>
												MARKET CAP
											</th>
											<th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-50 uppercase tracking-wider'>
												TOTAL VOLUME
											</th>
											<th scope='col' className='px-10 py-3 text-left text-xs font-medium text-gray-50 uppercase tracking-wider'>
												CIRCULATING SUPPLY
											</th>
										</tr>
									</thead>

									{data &&
										data?.map((currency: ICurrencyInfo, index: number) => {
											return <CurrencyList key={index} currency={currency} totalCurrency={index} />;
										})}
								</table>
							</div>
						</div>
					</div>
				</div>
			)}
		</section>
	);
};

export default Currencies;
