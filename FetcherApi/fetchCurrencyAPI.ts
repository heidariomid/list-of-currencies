import {ICurrencyInfo} from '../interfaces/ICurrencyInfo';

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
