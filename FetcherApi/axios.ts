import axios, {AxiosRequestConfig} from 'axios';
const config: AxiosRequestConfig = {
	baseURL: 'https://api.coingecko.com/api/v3',
};
export const axiosInstance = axios.create({
	...config,
	timeout: 10000,
	headers: {
		'Content-Type': 'application/json',
	},
});
export const fetchCurrenciesLength = async () => {
	const {data} = await axiosInstance.get('/simple/supported_vs_currencies');
	return data.length;
};
export const fetchCurrencies = async (page?: number | 1, perPage?: number | 10) => {
	try {
		const {data} = await axiosInstance.get(`/coins/markets?vs_currency=usd&page=${page}&per_page=${perPage}&price_change_percentage=24h,7d`);
		return data;
	} catch (error) {
		console.error(error);
	}
};
