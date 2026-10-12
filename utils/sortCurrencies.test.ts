import {describe, expect, it} from 'vitest';
import {sortCurrencies} from './sortCurrencies';

const rows = [
	{id: 'a', current_price: null, market_cap_rank: 1},
	{id: 'b', current_price: 5, market_cap_rank: 2},
	{id: 'c', current_price: 1, market_cap_rank: 3},
	{id: 'd', current_price: undefined, market_cap_rank: 4},
];

describe('sortCurrencies', () => {
	it('sorts null and undefined numeric values last in both directions', () => {
		expect(sortCurrencies(rows, 'current_price', 'asc').map((row) => row.id)).toEqual(['c', 'b', 'a', 'd']);
		expect(sortCurrencies(rows, 'current_price', 'desc').map((row) => row.id)).toEqual(['b', 'c', 'a', 'd']);
	});
});
