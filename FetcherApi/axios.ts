import axios, {AxiosRequestConfig} from 'axios';
const config: AxiosRequestConfig = {
	baseURL: 'https://api.coingecko.com/api/v3',
};
export const axiosInstance = axios.create({
	...config,
	headers: {
		'Access-Control-Allow-Origin': '*',
	},
});
export const fetchCurrenciesAll = async () => {
	console.log('fetchCurrenciesAll');
	const {data} = await axiosInstance.get('/simple/supported_vs_currencies');
	return data;
};
export const fetchCurrencies = async (page?: number | 1, perPage?: number | 10) => {
	console.log('fetchCurrencies');
	try {
		const {data} = await axiosInstance.get(`/coins/markets?vs_currency=usd&page=${page}&per_page=${10}&price_change_percentage=24h,7d`);
		return data;
	} catch (error) {
		console.error(error);
	}
};
export const fetchAllCurrencies = async () => {
	console.log('fetchAllCurrencies');
	try {
		const {data} = await axiosInstance.get(`/coins/markets?vs_currency=usd&page=1&per_page=70&price_change_percentage=24h,7d`);
		return data;
	} catch (error) {
		console.error(error);
	}
};
export const searchCurrencies = async (query: string) => {
	console.log('searchCurrencies');
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
