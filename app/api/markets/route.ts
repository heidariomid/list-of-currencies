import {unstable_cache} from 'next/cache';
import type {ICurrencyInfo} from '../../../interfaces/ICurrencyInfo';

const MARKETS_URL =
	'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&page=1&per_page=250&price_change_percentage=24h,7d';

const REVALIDATE_SECONDS = 300;

class UpstreamError extends Error {
	status: number;

	constructor(status: number) {
		super('CoinGecko request failed');
		this.name = 'UpstreamError';
		this.status = status;
	}
}

type MemoryEntry = {
	expiresAt: number;
	coins: ICurrencyInfo[];
};

let memory: MemoryEntry | null = null;
let inFlight: Promise<ICurrencyInfo[]> | null = null;

async function readUpstream(): Promise<ICurrencyInfo[]> {
	const now = Date.now();
	if (memory && memory.expiresAt > now) return memory.coins;
	if (inFlight) return inFlight;

	inFlight = loadUpstream().finally(() => {
		inFlight = null;
	});
	return inFlight;
}

async function loadUpstream(): Promise<ICurrencyInfo[]> {
	const response = await fetch(MARKETS_URL, {
		cache: 'no-store',
		headers: {Accept: 'application/json'},
	});
	if (!response.ok) throw new UpstreamError(response.status);

	const coins: unknown = await response.json();
	if (!Array.isArray(coins)) throw new UpstreamError(502);

	memory = {expiresAt: Date.now() + REVALIDATE_SECONDS * 1000, coins};
	return coins as ICurrencyInfo[];
}

const readCachedUpstream = unstable_cache(readUpstream, ['coingecko-markets'], {revalidate: REVALIDATE_SECONDS});

function statusOf(error: unknown) {
	if (error instanceof UpstreamError) return error.status;
	if (typeof error === 'object' && error !== null && 'status' in error && typeof error.status === 'number') return error.status;
	return 502;
}

export async function GET() {
	try {
		const coins = await readCachedUpstream();
		return Response.json(coins, {
			headers: {'Cache-Control': 'public, max-age=300, s-maxage=300'},
		});
	} catch (error) {
		return Response.json({error: 'upstream'}, {status: statusOf(error), headers: {'Cache-Control': 'no-store'}});
	}
}
