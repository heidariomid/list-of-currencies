export type CurrencyListProps = {
	currency?: ICurrencyInfo;
	newCurrencies?: ICurrencyInfo[] | undefined;
	totalCurrency?: number;
};
export type ICurrencyInfo = {
	id: string;
	symbol: string;
	name: string;
	image: string;
	current_price: number;
	market_cap_rank: number;
	high_24h: number;
	low_24h: number;
	price_change_24h: number;
	price_change_percentage_24h: number;
	total_volume: number;
	last_updated: string;
};
