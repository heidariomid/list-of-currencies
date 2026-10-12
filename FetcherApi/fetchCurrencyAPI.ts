import type {CoinChart} from '../interfaces/ICoinDetail';
import {ICurrencyInfo} from '../interfaces/ICurrencyInfo';
import type {ChartRange} from '../utils/chartSeries';

export class MarketsError extends Error {
	status: number;

	constructor(status: number) {
		super('Markets request failed');
		this.name = 'MarketsError';
		this.status = status;
	}
}

export const fetchCurrencies = async () => {
	const response = await fetch('/api/markets');
	if (!response.ok) throw new MarketsError(response.status);
	return (await response.json()) as ICurrencyInfo[];
};

export const fetchCoinChart = async (id: string, days: ChartRange, symbol: string) => {
	const params = new URLSearchParams({days, symbol});
	const response = await fetch(`/api/coins/${encodeURIComponent(id)}/chart?${params}`);
	if (!response.ok) throw new MarketsError(response.status);
	return (await response.json()) as CoinChart;
};
