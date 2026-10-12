import {axiosInstance} from './axiosInstance';
import {ICurrencyInfo} from '../interfaces/ICurrencyInfo';

const LIST_SIZE = 250;

// One request covers search and every page. CoinGecko caps this call at 250.
export const fetchCurrencies = async () => {
	const {data} = await axiosInstance.get<ICurrencyInfo[]>(
		`/coins/markets?vs_currency=usd&order=market_cap_desc&page=1&per_page=${LIST_SIZE}&price_change_percentage=24h,7d`,
	);
	return data;
};
