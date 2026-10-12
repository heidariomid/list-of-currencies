import {describe, expect, it} from 'vitest';
import {httpUrl, mapChart, mapCoin, plainDescription} from './mapCoin';
import {UpstreamError} from './upstream';
import {normalizeCoinId} from './coinId';

const coin = {
	id: 'bitcoin',
	symbol: 'btc',
	name: 'Bitcoin',
	market_cap_rank: 1,
	image: {large: 'https://cdn.example/btc.png'},
	description: {en: 'Peer to peer.\n\n<script>alert(1)</script>Fixed supply.'},
	categories: ['Layer 1 (L1)', 'Layer 1 (L1)', 'Payments'],
	links: {
		homepage: ['http://www.bitcoin.org', 'javascript:alert(1)'],
		whitepaper: 'https://bitcoin.org/bitcoin.pdf',
		blockchain_site: ['', 'https://mempool.space/'],
		twitter_screen_name: 'bitcoin',
	},
	market_data: {
		current_price: {usd: 82000},
		price_change_24h: -1000,
		price_change_percentage_24h: -1.2,
		price_change_percentage_7d: -3,
		price_change_percentage_30d: 6,
		price_change_percentage_1y: -20,
		market_cap: {usd: 1_600_000_000_000},
		market_cap_change_percentage_24h: -1,
		total_volume: {usd: 25_000_000_000},
		fully_diluted_valuation: {usd: 1_700_000_000_000},
		high_24h: {usd: 84000},
		low_24h: {usd: 81000},
		circulating_supply: 20_000_000,
		total_supply: 20_000_000,
		max_supply: 21_000_000,
		ath: {usd: 126000},
		ath_change_percentage: {usd: -30},
		ath_date: {usd: '2025-10-06T10:57:42.000Z'},
		atl: {usd: 67},
		atl_change_percentage: {usd: 1000},
		atl_date: {usd: '2013-07-06T00:00:00.000Z'},
		last_updated: '2026-10-12T18:00:00.000Z',
	},
};

describe('mapCoin', () => {
	it('keeps the market fields the detail page renders', () => {
		const mapped = mapCoin(coin);
		expect(mapped.price).toBe(82000);
		expect(mapped.rank).toBe(1);
		expect(mapped.high24h).toBe(84000);
		expect(mapped.athDate).toBe('2025-10-06T10:57:42.000Z');
		expect(mapped.categories).toEqual(['Layer 1 (L1)', 'Payments']);
		expect(mapped.links.map((link) => link.label)).toEqual(['Website', 'Whitepaper', 'Explorer', 'X']);
		expect(mapped.description).not.toContain('<script>');
		expect(mapped.description).toContain('Fixed supply.');
	});

	it('rejects a payload without a price', () => {
		expect(() => mapCoin({id: 'bitcoin', symbol: 'btc', name: 'Bitcoin'})).toThrow(UpstreamError);
	});

	it('drops non-http links and unsafe coin ids', () => {
		expect(httpUrl('javascript:alert(1)')).toBeNull();
		expect(plainDescription('A &amp; B')).toBe('A & B');
		expect(normalizeCoinId('Bitcoin')).toBe('bitcoin');
		expect(normalizeCoinId('../etc')).toBeNull();
	});
});

describe('mapChart', () => {
	it('pairs each price with the volume at the same index', () => {
		const chart = mapChart({
			prices: [
				[10, 1],
				[20, 2],
			],
			total_volumes: [
				[10, 5],
				[20, 8],
			],
		});
		expect(chart.points).toEqual([
			{t: 10, price: 1, volume: 5},
			{t: 20, price: 2, volume: 8},
		]);
	});

	it('rejects a chart that is too short', () => {
		expect(() => mapChart({prices: [[1, 1]], total_volumes: []})).toThrow(UpstreamError);
	});
});
