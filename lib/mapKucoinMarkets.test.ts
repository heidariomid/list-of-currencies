import {describe, expect, it} from 'vitest';
import {mapKucoinMarkets} from './mapKucoinMarkets';

describe('mapKucoinMarkets', () => {
	it('keeps USDT markets, ranks them by volume, and drops leveraged tokens', () => {
		const coins = mapKucoinMarkets(
			[
				{symbol: 'ETH-USDT', last: '2500', changeRate: '-0.01', changePrice: '-25', high: '2600', low: '2400', volValue: '50'},
				{symbol: 'BTC-USDT', last: '80000', changeRate: '0.02', changePrice: '1600', high: '81000', low: '79000', volValue: '200'},
				{symbol: 'BTC3L-USDT', last: '1', changeRate: '0.1', changePrice: '0.1', high: '1.2', low: '0.8', volValue: '9999'},
				{symbol: 'BTC-USDC', last: '80000', changeRate: '0.02', changePrice: '1600', high: '81000', low: '79000', volValue: '10'},
			],
			[{currency: 'BTC', fullName: 'Bitcoin'}],
			'2026-10-12T00:00:00.000Z',
		);

		expect(coins.map((coin) => coin.id)).toEqual(['btc', 'eth']);
		expect(coins[0]).toMatchObject({
			name: 'Bitcoin',
			symbol: 'btc',
			market_cap_rank: 1,
			current_price: 80000,
			price_change_percentage_24h: 2,
			total_volume: 200,
			last_updated: '2026-10-12T00:00:00.000Z',
		});
		expect(coins[1].name).toBe('ETH');
		expect(coins[1].market_cap_rank).toBe(2);
	});
});
