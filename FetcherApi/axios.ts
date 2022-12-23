import axios from 'axios';

export const fetchCurrenciesLength = async () => {
	const {data} = await axios.get('https://api.coingecko.com/api/v3/simple/supported_vs_currencies');
	return data.length;
};
export const fetchCurrencies = async (page?: number | 1, perPage?: number | 10) => {
	const {data} = await axios.get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&page=${page}&per_page=${perPage}&price_change_percentage=24h,7d`);
	return data;
};
