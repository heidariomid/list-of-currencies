import {normalizeCoinId} from '../../../../lib/coinId';
import {detailFromMarket} from '../../../../lib/detailFromMarket';
import {findMarket} from '../../../../lib/findMarket';
import {getMarkets} from '../../../../lib/markets';
import {statusOf} from '../../../../lib/upstream';

export async function GET(_request: Request, {params}: {params: Promise<{id: string}>}) {
	const {id} = await params;
	const coinId = normalizeCoinId(id);
	if (!coinId) return Response.json({error: 'invalid'}, {status: 400, headers: {'Cache-Control': 'no-store'}});

	try {
		const coins = await getMarkets();
		const row = findMarket(coins, coinId);
		const coin = row ? detailFromMarket(row) : null;
		if (!coin) return Response.json({error: 'missing'}, {status: 404, headers: {'Cache-Control': 'no-store'}});
		return Response.json(coin, {headers: {'Cache-Control': 'public, max-age=300, s-maxage=300'}});
	} catch (error) {
		return Response.json({error: 'upstream'}, {status: statusOf(error), headers: {'Cache-Control': 'no-store'}});
	}
}
