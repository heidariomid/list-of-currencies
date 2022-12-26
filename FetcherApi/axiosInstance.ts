import axios, {AxiosRequestConfig} from 'axios';
const config: AxiosRequestConfig = {
	baseURL: 'https://api.coingecko.com/api/v3',
};
export const axiosInstance = axios.create({
	...config,
});
