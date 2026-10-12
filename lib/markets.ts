import {unstable_cache} from 'next/cache';
import {cache} from 'react';
import type {ICurrencyInfo} from '../interfaces/ICurrencyInfo';
import {mapKucoinMarkets} from './mapKucoinMarkets';
import {UpstreamError} from './upstream';

const REVALIDATE_SECONDS = 300;

type MemoryEntry = {
	expiresAt: number;
	coins: ICurrencyInfo[];
};

let memory: MemoryEntry | null = null;
let inFlight: Promise<ICurrencyInfo[]> | null = null;

async function kucoin(url: string): Promise<unknown> {
	const response = await fetch(url, {cache: 'no-store', headers: {Accept: 'application/json'}});
	if (response.status === 429) throw new UpstreamError(429);
	if (!response.ok) throw new UpstreamError(response.status);
	const body: unknown = await response.json();
	if (!body || typeof body !== 'object' || (body as {code?: unknown}).code !== '200000') throw new UpstreamError(502);
	return (body as {data?: unknown}).data;
}

function listFrom(value: unknown, key?: string): unknown[] {
	if (Array.isArray(value)) return value;
	if (value && typeof value === 'object' && key) {
		const nested = (value as Record<string, unknown>)[key];
		if (Array.isArray(nested)) return nested;
	}
	return [];
}

async function loadUpstream(): Promise<ICurrencyInfo[]> {
	const [tickers, currencies] = await Promise.all([
		kucoin('https://api.kucoin.com/api/v1/market/allTickers'),
		kucoin('https://api.kucoin.com/api/v3/currencies'),
	]);
	const coins = mapKucoinMarkets(listFrom(tickers, 'ticker'), listFrom(currencies), new Date().toISOString());
	if (coins.length < 2) throw new UpstreamError(502);

	memory = {expiresAt: Date.now() + REVALIDATE_SECONDS * 1000, coins};
	return coins;
}

async function readUpstream(): Promise<ICurrencyInfo[]> {
	if (memory && memory.expiresAt > Date.now()) return memory.coins;
	if (inFlight) return inFlight;

	inFlight = loadUpstream().finally(() => {
		inFlight = null;
	});
	return inFlight;
}

const readCachedUpstream = unstable_cache(readUpstream, ['kucoin-markets'], {revalidate: REVALIDATE_SECONDS});

export const getMarkets = cache(() => readCachedUpstream());
