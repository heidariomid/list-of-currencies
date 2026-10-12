import {describe, expect, it} from 'vitest';
import {kucoinPairs, mapKucoinCandles} from './kucoinChart';

describe('kucoin charts', () => {
	it('asks KuCoin for a USDT pair, then USDC', () => {
		expect(kucoinPairs('btc')).toEqual(['BTC-USDT', 'BTC-USDC']);
		expect(kucoinPairs('usdt')).toEqual(['USDT-USDC']);
	});

	it('reads the close price and puts the oldest candle first', () => {
		const points = mapKucoinCandles([
			['200', '10', '12', '13', '9', '1', '30'],
			['100', '8', '9', '9', '7', '1', '20'],
		]);
		expect(points).toEqual([
			{t: 100000, price: 9, volume: 20},
			{t: 200000, price: 12, volume: 30},
		]);
	});
});
