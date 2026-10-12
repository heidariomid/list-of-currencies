import type {ChartPoint, CoinChart} from '../interfaces/ICoinDetail';
import {downsample, type ChartRange} from '../utils/chartSeries';
import {UpstreamError} from './upstream';

const REVALIDATE_MS = 5 * 60 * 1000;

const RANGE_QUERY: Record<ChartRange, {type: string; seconds: number}> = {
	'1': {type: '5min', seconds: 24 * 60 * 60},
	'7': {type: '1hour', seconds: 7 * 24 * 60 * 60},
	'30': {type: '1hour', seconds: 30 * 24 * 60 * 60},
	'90': {type: '4hour', seconds: 90 * 24 * 60 * 60},
	'365': {type: '1day', seconds: 365 * 24 * 60 * 60},
};

type Entry = {expiresAt: number; data: CoinChart};

const store = new Map<string, Entry>();
const flights = new Map<string, Promise<CoinChart>>();

export function kucoinPairs(symbol: string): string[] {
	const base = symbol.toUpperCase().replace(/[^A-Z0-9]/g, '');
	if (!base) return [];
	return ['USDT', 'USDC'].filter((quote) => quote !== base).map((quote) => `${base}-${quote}`);
}

export function mapKucoinCandles(raw: unknown): ChartPoint[] {
	if (!Array.isArray(raw)) return [];
	const points: ChartPoint[] = [];
	for (const row of raw) {
		if (!Array.isArray(row) || row.length < 3) continue;
		const seconds = Number(row[0]);
		const price = Number(row[2]);
		const volume = Number(row[6]);
		if (!Number.isFinite(seconds) || !Number.isFinite(price)) continue;
		points.push({
			t: seconds < 1e12 ? seconds * 1000 : seconds,
			price,
			volume: Number.isFinite(volume) ? volume : 0,
		});
	}
	points.sort((a, b) => a.t - b.t);
	return points;
}

async function fetchPair(pair: string, days: ChartRange): Promise<CoinChart | null> {
	const query = RANGE_QUERY[days];
	const end = Math.floor(Date.now() / 1000);
	const start = end - query.seconds;
	const url = `https://api.kucoin.com/api/v1/market/candles?type=${query.type}&symbol=${encodeURIComponent(pair)}&startAt=${start}&endAt=${end}`;
	const response = await fetch(url, {cache: 'no-store', headers: {Accept: 'application/json'}});
	if (response.status === 429) throw new UpstreamError(429);
	if (!response.ok) throw new UpstreamError(response.status);

	const body: unknown = await response.json();
	if (!body || typeof body !== 'object') throw new UpstreamError(502);
	const payload = body as {code?: unknown; data?: unknown};
	if (payload.code === '400100') return null;
	if (payload.code !== '200000') throw new UpstreamError(502);

	const points = downsample(mapKucoinCandles(payload.data), 480);
	if (points.length < 2) return null;
	return {points};
}

async function loadChart(symbol: string, days: ChartRange): Promise<CoinChart> {
	for (const pair of kucoinPairs(symbol)) {
		const chart = await fetchPair(pair, days);
		if (chart) return chart;
	}
	throw new UpstreamError(404);
}

export function getKucoinChart(symbol: string, days: ChartRange): Promise<CoinChart> {
	const key = `${symbol.toLowerCase()}:${days}`;
	const hit = store.get(key);
	if (hit && hit.expiresAt > Date.now()) return Promise.resolve(hit.data);
	const pending = flights.get(key);
	if (pending) return pending;

	const flight = loadChart(symbol, days)
		.then((data) => {
			store.set(key, {expiresAt: Date.now() + REVALIDATE_MS, data});
			return data;
		})
		.finally(() => {
			flights.delete(key);
		});
	flights.set(key, flight);
	return flight;
}
