import type {ChartPoint, CoinDetail, CoinLink} from '../interfaces/ICoinDetail';
import {downsample} from '../utils/chartSeries';
import {UpstreamError} from './upstream';

function num(value: unknown): number | null {
	return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function text(value: unknown): string | null {
	return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function usd(value: unknown): number | null {
	if (!value || typeof value !== 'object') return null;
	return num((value as {usd?: unknown}).usd);
}

function usdText(value: unknown): string | null {
	if (!value || typeof value !== 'object') return null;
	return text((value as {usd?: unknown}).usd);
}

export function httpUrl(value: unknown): string | null {
	if (typeof value !== 'string' || !value.trim()) return null;
	try {
		const url = new URL(value.trim());
		if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
		return url.toString();
	} catch {
		return null;
	}
}

export function plainDescription(value: string): string {
	const stripped = value
		.replace(/<br\s*\/?>/gi, '\n')
		.replace(/<\/p>/gi, '\n\n')
		.replace(/<[^>]+>/g, '')
		.replace(/&#(\d+);/g, (_, code: string) => {
			const point = Number(code);
			return point > 0 && point < 65536 ? String.fromCodePoint(point) : '';
		})
		.replace(/&#x([0-9a-f]+);/gi, (_, code: string) => {
			const point = Number.parseInt(code, 16);
			return point > 0 && point < 65536 ? String.fromCodePoint(point) : '';
		})
		.replace(/&nbsp;/gi, ' ')
		.replace(/&amp;/gi, '&')
		.replace(/&lt;/gi, '<')
		.replace(/&gt;/gi, '>')
		.replace(/&quot;/gi, '"')
		.replace(/&#39;|&apos;/gi, "'");
	const plain = stripped
		.replace(/[ \t]+\n/g, '\n')
		.replace(/\n{3,}/g, '\n\n')
		.trim();
	return plain.length > 2500 ? `${plain.slice(0, 2500).trimEnd()}…` : plain;
}

function firstUrl(value: unknown): string | null {
	if (!Array.isArray(value)) return null;
	for (const item of value) {
		const url = httpUrl(item);
		if (url) return url;
	}
	return null;
}

function linksOf(value: unknown): CoinLink[] {
	if (!value || typeof value !== 'object') return [];
	const source = value as {homepage?: unknown; whitepaper?: unknown; blockchain_site?: unknown; twitter_screen_name?: unknown};
	const links: CoinLink[] = [];
	const homepage = firstUrl(source.homepage);
	if (homepage) links.push({label: 'Website', href: homepage});
	const whitepaper = httpUrl(source.whitepaper);
	if (whitepaper) links.push({label: 'Whitepaper', href: whitepaper});
	const explorer = firstUrl(source.blockchain_site);
	if (explorer) links.push({label: 'Explorer', href: explorer});
	if (typeof source.twitter_screen_name === 'string' && /^[A-Za-z0-9_]{1,15}$/.test(source.twitter_screen_name)) {
		links.push({label: 'X', href: `https://x.com/${source.twitter_screen_name}`});
	}
	return links;
}

function categoriesOf(value: unknown): string[] {
	if (!Array.isArray(value)) return [];
	const seen = new Set<string>();
	const categories: string[] = [];
	for (const item of value) {
		if (typeof item !== 'string') continue;
		const label = item.trim();
		if (!label || seen.has(label)) continue;
		seen.add(label);
		categories.push(label);
		if (categories.length === 4) break;
	}
	return categories;
}

function imageOf(value: unknown): string {
	if (!value || typeof value !== 'object') return '';
	const image = value as {large?: unknown; small?: unknown; thumb?: unknown};
	return httpUrl(image.large) ?? httpUrl(image.small) ?? httpUrl(image.thumb) ?? '';
}

export function mapCoin(raw: unknown): CoinDetail {
	if (!raw || typeof raw !== 'object') throw new UpstreamError(502);
	const coin = raw as {
		id?: unknown;
		symbol?: unknown;
		name?: unknown;
		image?: unknown;
		description?: {en?: unknown};
		links?: unknown;
		categories?: unknown;
		market_cap_rank?: unknown;
		last_updated?: unknown;
		market_data?: {
			current_price?: unknown;
			price_change_percentage_24h?: unknown;
			price_change_24h?: unknown;
			price_change_percentage_7d?: unknown;
			price_change_percentage_30d?: unknown;
			price_change_percentage_1y?: unknown;
			market_cap?: unknown;
			market_cap_change_percentage_24h?: unknown;
			total_volume?: unknown;
			fully_diluted_valuation?: unknown;
			high_24h?: unknown;
			low_24h?: unknown;
			circulating_supply?: unknown;
			total_supply?: unknown;
			max_supply?: unknown;
			ath?: unknown;
			ath_change_percentage?: unknown;
			ath_date?: unknown;
			atl?: unknown;
			atl_change_percentage?: unknown;
			atl_date?: unknown;
			last_updated?: unknown;
		};
	};
	const id = text(coin.id);
	const symbol = text(coin.symbol);
	const name = text(coin.name);
	const market = coin.market_data;
	const price = usd(market?.current_price);
	if (!id || !symbol || !name || price == null) throw new UpstreamError(502);
	const description = typeof coin.description?.en === 'string' ? plainDescription(coin.description.en) : '';

	return {
		id,
		symbol,
		name,
		image: imageOf(coin.image),
		rank: num(coin.market_cap_rank),
		description,
		categories: categoriesOf(coin.categories),
		links: linksOf(coin.links),
		price,
		change24h: num(market?.price_change_percentage_24h),
		change24hValue: num(market?.price_change_24h),
		change7d: num(market?.price_change_percentage_7d),
		change30d: num(market?.price_change_percentage_30d),
		change1y: num(market?.price_change_percentage_1y),
		marketCap: usd(market?.market_cap),
		marketCapChange24h: num(market?.market_cap_change_percentage_24h),
		volume: usd(market?.total_volume),
		fdv: usd(market?.fully_diluted_valuation),
		high24h: usd(market?.high_24h),
		low24h: usd(market?.low_24h),
		circulatingSupply: num(market?.circulating_supply),
		totalSupply: num(market?.total_supply),
		maxSupply: num(market?.max_supply),
		ath: usd(market?.ath),
		athChange: usd(market?.ath_change_percentage),
		athDate: usdText(market?.ath_date),
		atl: usd(market?.atl),
		atlChange: usd(market?.atl_change_percentage),
		atlDate: usdText(market?.atl_date),
		lastUpdated: text(market?.last_updated) ?? text(coin.last_updated),
	};
}

function pairs(value: unknown): [number, number][] {
	if (!Array.isArray(value)) return [];
	const rows: [number, number][] = [];
	for (const row of value) {
		if (!Array.isArray(row) || row.length < 2) continue;
		const time = row[0];
		const amount = row[1];
		if (typeof time !== 'number' || typeof amount !== 'number') continue;
		if (!Number.isFinite(time) || !Number.isFinite(amount)) continue;
		rows.push([time, amount]);
	}
	return rows;
}

export function mapChart(raw: unknown): {points: ChartPoint[]} {
	if (!raw || typeof raw !== 'object') throw new UpstreamError(502);
	const body = raw as {prices?: unknown; total_volumes?: unknown};
	const prices = pairs(body.prices);
	const volumes = pairs(body.total_volumes);
	const points = prices.map(([t, price], index) => ({
		t,
		price,
		volume: volumes[index]?.[1] ?? 0,
	}));
	points.sort((a, b) => a.t - b.t);
	if (points.length < 2) throw new UpstreamError(502);
	return {points: downsample(points, 480)};
}
