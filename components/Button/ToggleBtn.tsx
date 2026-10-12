'use client';

import {Switch} from '@headlessui/react';
import {useCurrentTheme} from '../../hooks/useCurrentTheme';

const ToggleBtn = () => {
	const {currentTheme, setTheme} = useCurrentTheme();
	const isDark = currentTheme === 'dark';

	if (!currentTheme) {
		return <span aria-hidden='true' className='inline-block h-6 w-11 shrink-0 rounded-full bg-white shadow-inner shadow-gray-500' />;
	}

	return (
		<Switch
			checked={isDark}
			onChange={(checked) => setTheme(checked ? 'dark' : 'light')}
			className='relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-white shadow-inner shadow-gray-500 transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-ocean'
		>
			<span className='sr-only'>{isDark ? 'Switch to light mode' : 'Switch to dark mode'}</span>
			<span
				className={`${
					isDark ? 'translate-x-0' : 'translate-x-5'
				} pointer-events-none relative inline-flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500 shadow ring-0 transition duration-200 ease-in-out`}
			>
				<span className={`${isDark ? 'opacity-100' : 'opacity-0'} absolute inset-0 flex items-center justify-center transition-opacity`} aria-hidden='true'>
					<svg fill='white' viewBox='0 0 24 24' className='h-3.5 w-3.5'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							d='M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z'
						/>
					</svg>
				</span>
				<span
					className={`${
						isDark ? 'opacity-0' : 'opacity-100'
					} absolute inset-0 flex items-center justify-center rounded-full bg-orange-200 text-black transition-opacity`}
					aria-hidden='true'
				>
					<svg className='h-3.5 w-3.5' viewBox='0 0 20 20'>
						<path d='M3.183,9.381H0.704v1.239h2.479V9.381z M2.989,16.135l0.876,0.877l1.752-1.754l-0.876-0.875L2.989,16.135z M17.012,3.866l-0.877-0.876l-1.752,1.752l0.875,0.876L17.012,3.866z M10.62,0.705H9.38v2.479h1.239V0.705z M5.618,4.742 L3.865,2.989L2.989,3.866l1.753,1.752L5.618,4.742z M14.383,15.258l1.752,1.754l0.877-0.877l-1.754-1.752L14.383,15.258z M9.38,19.297h1.239v-2.48H9.38V19.297z M16.816,9.381v1.239h2.479V9.381H16.816z M10,5.042c-2.738,0-4.958,2.22-4.958,4.958 c0,2.738,2.22,4.959,4.958,4.959c2.738,0,4.958-2.221,4.958-4.959C14.958,7.263,12.738,5.042,10,5.042z M10,13.727 c-2.058,0-3.726-1.668-3.726-3.727c0-2.058,1.668-3.726,3.726-3.726c2.059,0,3.727,1.668,3.727,3.726 C13.727,12.059,12.059,13.727,10,13.727z'></path>
					</svg>
				</span>
			</span>
		</Switch>
	);
};

export default ToggleBtn;
