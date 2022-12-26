import axios from 'axios';
import {axiosInstance} from './axiosInstance';

// fetch currencies with pagination
export const fetchCurrencies = async (page?: number | 1, perPage?: number | 10) => {
	console.log('fetchCurrencies');
	try {
		const {data} = await axiosInstance.get(`/coins/markets?vs_currency=usd&page=${page}&per_page=${perPage}&price_change_percentage=24h,7d`);
		return data;
	} catch (error) {
		console.error(error);
	}
};
// fetch all currencies
export const fetchAllCurrencies = async () => {
	console.log('fetchAllCurrencies');
	try {
		const {data} = await axiosInstance.get(`/coins/markets?vs_currency=usd&page=1&per_page=70&price_change_percentage=24h,7d`);
		return data;
	} catch (error) {
		console.error(error);
	}
};
// fetch currency by query
export const searchCurrencies = async (query: string) => {
	try {
		const {data} = await axiosInstance.get(`/search?query=${query}`);
		return data;
	} catch (error) {
		console.error(error);
	}
};

// mocked all currencies data
export const allMockedCurrencies = async () => {
	const {data} = await axios.get('http://localhost:3001/allCurrencies');
	return data;
};
// mocked currencies data
export const mockedCurrencies = async () => {
	const {data} = await axios.get('http://localhost:3001/currencies');
	return data;
};
