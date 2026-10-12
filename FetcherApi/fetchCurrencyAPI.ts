import {axiosInstance} from './axiosInstance';
import {ICurrencyInfo} from '../interfaces/ICurrencyInfo';

// fetch currencies with pagination
export const fetchCurrencies = async (page?: number | 1, perPage?: number | 10) => {
	const {data} = await axiosInstance.get<ICurrencyInfo[]>(`/coins/markets?vs_currency=usd&page=${page}&per_page=${perPage}&price_change_percentage=24h,7d`);
	return data;
};
// fetch all currencies
export const fetchAllCurrencies = async () => {
	const {data} = await axiosInstance.get<ICurrencyInfo[]>(`/coins/markets?vs_currency=usd&page=1&per_page=70&price_change_percentage=24h,7d`);
	return data;
};
// fetch currency by query
export const searchCurrencies = async (query: string) => {
	const {data} = await axiosInstance.get(`/search?query=${query}`);
	return data;
};
