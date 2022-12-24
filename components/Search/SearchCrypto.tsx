import {Transition} from '@headlessui/react';
import {Fragment, useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {useMutation, useQuery} from 'react-query';
import {ICurrencyInfo} from '../../interfaces/ICurrencyInfo';
import {fetchCurrencies} from '../../FetcherApi/axios';

const SearchCrypto = ({setNewCurrencies}: any) => {
	const [query, setQuery] = useState<any>(null);
	const [page, setPage] = useState<number>(1);
	const [message, setMessage] = useState<string | undefined>('');
	const [show, setShow] = useState(false);
	const {register, getValues, handleSubmit, clearErrors} = useForm({mode: 'onChange'});

	const onValidSubmit = (e: any) => {
		const {crypto} = getValues();
		setQuery(crypto);
	};
	const clearSearchErrors = () => clearErrors('crypto');

	const {data: currencies} = useQuery(['currencies'], () => fetchCurrencies(), {
		enabled: query === null,
	});
	useQuery(
		['filteredCurrencies', query],
		() => {
			if (query) {
				const filteredCurrencies = currencies?.filter((currency: ICurrencyInfo) => {
					return currency.name.toLowerCase().includes(query?.toLowerCase()) || currency.symbol.toLowerCase().includes(query?.toLowerCase());
				});
				if (filteredCurrencies.length > 0) {
					setShow(false);
					setNewCurrencies(filteredCurrencies);
				}
				if (filteredCurrencies.length === 0) {
					setMessage('No result found');
					setShow(true);
				}
			} else if (query === '') {
				setShow(false);
				// reload the page
				window.location.reload();
			}
		},
		{enabled: query !== null},
	);

	// useEffect(() => {
	// 	if (query) {
	// 		const filteredCurrencies = currencies?.filter((currency: any) => {
	// 			return currency.name.toLowerCase().includes(query?.toLowerCase()) || currency.symbol.toLowerCase().includes(query?.toLowerCase());
	// 		});
	// 		if (filteredCurrencies.length > 0) {
	// 			setNewCurrencies(filteredCurrencies);
	// 			setShow(false);
	// 		}
	// 		if (filteredCurrencies.length === 0) {
	// 			setMessage('No result found');
	// 			setShow(true);
	// 		}
	// 	} else if (query === '') {
	// 		setNewCurrencies(currencies);
	// 		setShow(false);
	// 	}
	// }, [query]);

	return (
		<div>
			<form onChange={handleSubmit(onValidSubmit)} className=' w-full  max-w-screen-md md:max-w-screen-xl flex items-center justify-center font-bold text-lg  text-center '>
				<div className='flex   items-center border-[1px] rounded-full  border-gray-200 dark:border-gray-600'>
					<input
						id='searchInput'
						className='flex-1 dark:bg-ocean input w-full placeholder:text-sm md:placeholder:text-md'
						type='search'
						{...register('crypto', {})}
						placeholder='ex:BTC,btc,bitcoin'
						onKeyDown={clearSearchErrors}
					/>
					<button className='  px-2 py-[2px] '>
						<svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
							<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
						</svg>
					</button>
				</div>
			</form>
			{message && (
				<Transition
					show={show}
					as={Fragment}
					enter='transform ease-out duration-300 transition'
					enterFrom='translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2'
					enterTo='translate-y-0 opacity-100 sm:translate-x-0'
					leave='transition ease-in duration-100'
					leaveFrom='opacity-100'
					leaveTo='opacity-0'
				>
					<p className=' flex justify-center items-center rounded-lg text-white bg-red-500 px-5 absolute'>{message}</p>
				</Transition>
			)}
			{/* {isLoading && (
				<div className=' flex justify-center items-center pt-4'>
					<div className='h-2  w-2 absolute border-2 border-green-400 animate-ping rounded-full'></div>
					<div className='h-3  w-3 absolute border-2 border-green-400 animate-ping rounded-full'></div>
					<div className='h-4  w-4 absolute border-2 border-green-400 animate-wiggle rounded-full'></div>
				</div>
			)} */}
		</div>
	);
};

export default SearchCrypto;
