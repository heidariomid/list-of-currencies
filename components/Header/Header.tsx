import ToggleBtn from '../Button/ToggleBtn';
import SearchCrypto from '../Search/SearchCrypto';

const Header = () => {
	return (
		<div className='flex  mt-14 max-w-screen-md md:max-w-screen-xl  justify-between items-center mx-auto px-20'>
			<SearchCrypto />
			<h1 className=' dark:text-pink-400 font-bold mr-48 text-xl  '>Cryptocurrency Prices</h1>

			<ToggleBtn />
		</div>
	);
};

export default Header;
