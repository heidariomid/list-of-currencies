import type {ICurrencyInfo} from '../interfaces/ICurrencyInfo';

const compact = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, '');

export function findMarket(coins: readonly ICurrencyInfo[], rawId: string): ICurrencyInfo | undefined {
	const key = rawId.trim().toLowerCase();
	const folded = compact(key);
	return coins.find((coin) => coin.id === key || coin.symbol === key || compact(coin.name) === folded);
}
