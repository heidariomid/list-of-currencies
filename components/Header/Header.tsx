import ToggleBtn from '../Button/ToggleBtn';
import SearchCrypto from '../Search/SearchCrypto';

const Header = ({setNewCurrencies, currencies}: any) => {
	return (
		<div className='flex  pt-20 max-w-screen-md md:max-w-screen-xl  justify-between items-center mx-auto px-20'>
			<SearchCrypto setNewCurrencies={setNewCurrencies} currencies={currencies} />
			<h1 className='dark:animate-textColor font-bold mr-0 lg:mr-48 md:text-xl  '>Cryptocurrency Prices</h1>
			<ToggleBtn />
		</div>
	);
};

export default Header;
