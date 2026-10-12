import type {NextRequest} from 'next/server';
import {normalizeCoinId} from '../../../../../lib/coinId';
import {getKucoinChart} from '../../../../../lib/kucoinChart';
import {statusOf} from '../../../../../lib/upstream';
import {isChartRange} from '../../../../../utils/chartSeries';

export async function GET(request: NextRequest, {params}: {params: Promise<{id: string}>}) {
	const {id} = await params;
	const coinId = normalizeCoinId(id);
	const days = request.nextUrl.searchParams.get('days') ?? '1';
	const symbol = (request.nextUrl.searchParams.get('symbol') ?? '').toLowerCase().replace(/[^a-z0-9]/g, '');
	if (!coinId || !isChartRange(days) || !symbol || symbol.length > 20) {
		return Response.json({error: 'invalid'}, {status: 400, headers: {'Cache-Control': 'no-store'}});
	}

	try {
		const chart = await getKucoinChart(symbol, days);
		return Response.json(chart, {headers: {'Cache-Control': 'public, max-age=60, s-maxage=60'}});
	} catch (error) {
		return Response.json({error: 'upstream'}, {status: statusOf(error), headers: {'Cache-Control': 'no-store'}});
	}
}
