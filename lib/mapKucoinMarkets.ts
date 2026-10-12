import type {ICurrencyInfo} from '../interfaces/ICurrencyInfo';

const LEVERAGED = /(?:3L|3S|UP|DOWN|BULL|BEAR)$/;

function num(value: unknown): number | null {
	if (typeof value !== 'string' && typeof value !== 'number') return null;
	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : null;
}

function namesOf(currencies: unknown[]): Map<string, string> {
	const names = new Map<string, string>();
	for (const item of currencies) {
		if (!item || typeof item !== 'object') continue;
		const row = item as {currency?: unknown; fullName?: unknown};
		if (typeof row.currency !== 'string' || !row.currency.trim()) continue;
		const fullName = typeof row.fullName === 'string' && row.fullName.trim() ? row.fullName.trim() : row.currency;
		names.set(row.currency.toUpperCase(), fullName);
	}
	return names;
}

export function mapKucoinMarkets(tickers: unknown[], currencies: unknown[], fetchedAt = ''): ICurrencyInfo[] {
	const names = namesOf(currencies);
	const rows: ICurrencyInfo[] = [];

	for (const item of tickers) {
		if (!item || typeof item !== 'object') continue;
		const ticker = item as {symbol?: unknown; last?: unknown; changeRate?: unknown; changePrice?: unknown; high?: unknown; low?: unknown; volValue?: unknown};
		if (typeof ticker.symbol !== 'string' || !ticker.symbol.endsWith('-USDT')) continue;
		const base = ticker.symbol.slice(0, -'-USDT'.length);
		if (!base || LEVERAGED.test(base)) continue;

		const price = num(ticker.last);
		const high = num(ticker.high);
		const low = num(ticker.low);
		const changeRate = num(ticker.changeRate);
		const change = num(ticker.changePrice);
		const volume = num(ticker.volValue);
		if (price == null || price <= 0 || high == null || low == null || changeRate == null || change == null || volume == null) continue;

		rows.push({
			id: base.toLowerCase(),
			symbol: base.toLowerCase(),
			name: names.get(base) ?? base,
			image: '',
			current_price: price,
			market_cap_rank: 0,
			high_24h: high,
			low_24h: low,
			price_change_24h: change,
			price_change_percentage_24h: changeRate * 100,
			total_volume: volume,
			last_updated: fetchedAt,
		});
	}

	rows.sort((a, b) => b.total_volume - a.total_volume);
	return rows.slice(0, 250).map((coin, index) => ({...coin, market_cap_rank: index + 1}));
}
