import {Transition} from '@headlessui/react';
import {Fragment, useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';

const SearchCrypto = () => {
	const [query, setQuery] = useState(null);
	const [message, setMessage] = useState<string | undefined>('');
	const [show, setShow] = useState(false);
	// const [_, dispatch] = useStateValue();
	const {register, getValues, handleSubmit, clearErrors, reset} = useForm({
		mode: 'onSubmit',
	});

	const onValidSubmit = (e: any) => {
		const {restaurantName} = getValues();
		setQuery(restaurantName);
	};
	const clearSearchErrors = () => clearErrors('restaurantName');

	const onCompleted = (data: any) => {
		const {ok, message, restaurants} = data?.searchRestaurants;
		if (!ok) {
			setMessage(message);
			setShow(true);
			setTimeout(() => {
				setShow(false);
			}, 2000);
		}
		if (ok && restaurants) {
			// dispatch({
			// 	type: 'SET_RESTAURANTS',
			// 	payload: {restaurants},
			// });
			setQuery(null);
			reset({restaurantName: ''});
		}
	};

	// const [handler, {loading}] = useLazyQuery<SearchRestaurantsQuery, SearchRestaurantsQueryVariables>(SEARCH_RESTAURANT, {onCompleted});
	useEffect(() => {
		if (query) {
			// handler({
			// 	variables: {
			// 		data: {query},
			// 	},
			// });
		} else if (query === '') {
			window.location.reload();
		}
	}, [query]);

	useEffect(() => {
		setTimeout(() => {
			setShow(false);
		}, 2000);
		return () => {
			setShow(true);
		};
	}, [message]);

	return (
		<div>
			<form onSubmit={handleSubmit(onValidSubmit)} className=' w-full max-w-screen-md md:max-w-screen-xl flex items-center justify-center font-bold text-lg  text-center '>
				<div className='flex   items-center border-2 rounded-full  border-gray-100'>
					<input
						id='searchInput'
						className='flex-1 input w-full placeholder:text-sm md:placeholder:text-md'
						type='search'
						{...register('restaurantName', {})}
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
			{false && (
				<div className=' flex justify-center items-center '>
					<div className='h-12  w-12 absolute border-2 border-green-400 animate-ping rounded-full'></div>
					<div className='h-14  w-14 absolute border-2 border-green-400 animate-ping rounded-full'></div>
					<div className='h-16  w-16 absolute border-2 border-green-400 animate-wiggle rounded-full'></div>
				</div>
			)}
		</div>
	);
};

export default SearchCrypto;
