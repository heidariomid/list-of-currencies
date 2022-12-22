import React from 'react';

const THeadCurrencies = () => {
	return (
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
	);
};

export default THeadCurrencies;
