import ToggleBtn from '../Button/ToggleBtn';
import SearchCrypto from '../Search/SearchCrypto';

const Header = ({setNewCurrencies, currencies}: any) => {
	return (
		<div className='flex flex-col md:flex-row max-w-screen-xl  pt-4 md:pt-20 w-full  justify-between items-center md:mx-auto lg:px-20'>
			<SearchCrypto setNewCurrencies={setNewCurrencies} currencies={currencies} />
			<h1 className='dark:animate-textColor font-bold mr-0 lg:mr-48 md:text-xl my-4 md:my-0'>Cryptocurrency Prices</h1>
			<ToggleBtn />
		</div>
	);
};

export default Header;
