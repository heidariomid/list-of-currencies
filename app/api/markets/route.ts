import {getMarkets} from '../../../lib/markets';
import {statusOf} from '../../../lib/upstream';

export async function GET() {
	try {
		const coins = await getMarkets();
		return Response.json(coins, {
			headers: {'Cache-Control': 'public, max-age=300, s-maxage=300'},
		});
	} catch (error) {
		return Response.json({error: 'upstream'}, {status: statusOf(error), headers: {'Cache-Control': 'no-store'}});
	}
}
