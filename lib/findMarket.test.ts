import {describe, expect, it} from 'vitest';
import type {ICurrencyInfo} from '../interfaces/ICurrencyInfo';
import {findMarket} from './findMarket';

const bitcoin = {
	id: 'btc',
	symbol: 'btc',
	name: 'Bitcoin',
	image: '',
	current_price: 1,
	market_cap_rank: 1,
	high_24h: 1,
	low_24h: 1,
	price_change_24h: 1,
	price_change_percentage_24h: 1,
	total_volume: 1,
	last_updated: '',
} satisfies ICurrencyInfo;

describe('findMarket', () => {
	it('matches the symbol, the id, and the coin name', () => {
		expect(findMarket([bitcoin], 'btc')?.id).toBe('btc');
		expect(findMarket([bitcoin], 'bitcoin')?.name).toBe('Bitcoin');
	});
});
