import ToggleBtn from '../Button/ToggleBtn';
import SearchCrypto from '../Search/SearchCrypto';

const Header = () => {
	return (
		<header className='flex w-full min-w-0 flex-col gap-4 md:flex-row md:items-center md:justify-between'>
			<h1 className='shrink-0 text-lg font-semibold tracking-tight text-gray-900 dark:text-white md:text-xl'>Cryptocurrency Prices</h1>
			<div className='flex w-full min-w-0 items-center gap-3 md:w-auto md:max-w-md md:justify-end'>
				<div className='min-w-0 flex-1'>
					<SearchCrypto />
				</div>
				<ToggleBtn />
			</div>
		</header>
	);
};

export default Header;
