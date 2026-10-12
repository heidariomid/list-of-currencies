'use client';

import {FormEvent} from 'react';
import {useListParams} from '../../hooks/useListParams';

const SearchCrypto = () => {
	const {q, setQuery} = useListParams();
	const onSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
	};

	return (
		<div>
			<form onSubmit={onSubmit} className=' w-full  max-w-screen-md md:max-w-screen-xl flex items-center justify-center font-bold text-lg  text-center '>
				<div className='flex items-center border-[1px] rounded-full  border-gray-200 dark:border-gray-600'>
					<input
						id='searchInput'
						className='flex-1 dark:bg-ocean input w-full placeholder:text-sm md:placeholder:text-md'
						type='search'
						value={q}
						placeholder='ex:BTC,btc,bitcoin'
						onChange={(event) => setQuery(event.target.value)}
					/>
					<button type='button' className='  px-2 py-[2px] ' aria-hidden='true' tabIndex={-1}>
						<svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
							<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
						</svg>
					</button>
				</div>
			</form>
		</div>
	);
};

export default SearchCrypto;
