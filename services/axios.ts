import axios from 'axios';
import {IfetchCurrencies} from '../interfaces/IFetchCurrencies';
// export const instance = axios.create({
// 	baseURL: 'https://api.coingecko.com/api/v3',
// 	headers: {
// 		'Access-Control-Allow-Origin': '*',
// 		'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
// 	},
// });

// export const fetchCurrency = async () => {
// 	const {data} = await instance.get('/coins/markets?vs_currency=usd&page=1&per_page=10&price_change_percentage=24h,7d');
// 	return data;
// };

export const fetchCurrenciesLength = async () => {
	const {data} = await axios.get('https://api.coingecko.com/api/v3/simple/supported_vs_currencies');
	return data.length;
};
export const fetchCurrencies = async (page: number, perPage: number) => {
	const {data} = await axios.get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&page=${page}&per_page=${perPage}&price_change_percentage=24h,7d`);
	return data;
};
