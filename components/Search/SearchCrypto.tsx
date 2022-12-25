import {Transition} from '@headlessui/react';
import {Fragment, useState} from 'react';
import {useForm} from 'react-hook-form';
import {actions} from '../../store/actions/actions';
import {useStateValue} from '../../store/context/ContextManager';

const SearchCrypto = () => {
	const [state, dispatch] = useStateValue();
	const {register, getValues, handleSubmit, clearErrors} = useForm({mode: 'onChange'});
	const onValidSubmit = () => {
		const {query} = getValues();
		if (query) {
			dispatch({
				type: actions.SEARCH_CURRENCY,
				payload: {query},
			});
		}
		if (query === '') {
			dispatch({
				type: actions.SEARCH_CURRENCY,
				payload: {query: 'empty'},
			});
		}
	};
	const clearSearchErrors = () => clearErrors('query');

	return (
		<div>
			<form onChange={handleSubmit(onValidSubmit)} className=' w-full  max-w-screen-md md:max-w-screen-xl flex items-center justify-center font-bold text-lg  text-center '>
				<div className='flex items-center border-[1px] rounded-full  border-gray-200 dark:border-gray-600'>
					<input
						id='searchInput'
						className='flex-1 dark:bg-ocean input w-full placeholder:text-sm md:placeholder:text-md'
						type='search'
						{...register('query', {})}
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
			{state?.currency?.showMessage && (
				<Transition
					show={state?.currency?.showMessage}
					as={Fragment}
					enter='transform ease-out duration-300 transition'
					enterFrom='translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2'
					enterTo='translate-y-0 opacity-100 sm:translate-x-0'
					leave='transition ease-in duration-100'
					leaveFrom='opacity-100'
					leaveTo='opacity-0'
				>
					<p className=' flex justify-center items-center rounded-lg text-white bg-red-500 px-5 absolute'>{state?.currency?.message}</p>
				</Transition>
			)}
		</div>
	);
};

export default SearchCrypto;
