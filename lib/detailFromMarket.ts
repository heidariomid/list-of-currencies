import type {CoinDetail} from '../interfaces/ICoinDetail';
import type {ICurrencyInfo} from '../interfaces/ICurrencyInfo';

function num(value: unknown): number | null {
	return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

export function detailFromMarket(coin: ICurrencyInfo): CoinDetail | null {
	const price = num(coin.current_price);
	if (!coin.id || !coin.symbol || !coin.name || price == null) return null;

	return {
		id: coin.id,
		symbol: coin.symbol,
		name: coin.name,
		image: '',
		rank: num(coin.market_cap_rank),
		description: '',
		categories: [],
		links: [],
		price,
		change24h: num(coin.price_change_percentage_24h),
		change24hValue: num(coin.price_change_24h),
		change7d: null,
		change30d: null,
		change1y: null,
		marketCap: null,
		marketCapChange24h: null,
		volume: num(coin.total_volume),
		fdv: null,
		high24h: num(coin.high_24h),
		low24h: num(coin.low_24h),
		circulatingSupply: null,
		totalSupply: null,
		maxSupply: null,
		ath: null,
		athChange: null,
		athDate: null,
		atl: null,
		atlChange: null,
		atlDate: null,
		lastUpdated: typeof coin.last_updated === 'string' ? coin.last_updated : null,
	};
}
