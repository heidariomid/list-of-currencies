import axios from 'axios';

export const fetchCurrencies = async () => {
	const {data} = await axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&page=1&per_page=20&price_change_percentage=24h,7d');
	return data;
};
