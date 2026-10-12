import type {Metadata} from 'next';
import {notFound, redirect} from 'next/navigation';
import CoinPage, {type CoinPageError} from '../../../components/Coin/CoinPage';
import {normalizeCoinId} from '../../../lib/coinId';
import {detailFromMarket} from '../../../lib/detailFromMarket';
import {getKucoinChart} from '../../../lib/kucoinChart';
import {getMarkets} from '../../../lib/markets';
import {statusOf} from '../../../lib/upstream';
import type {CoinChart, CoinDetail} from '../../../interfaces/ICoinDetail';

type CoinRouteProps = {
	params: Promise<{id: string}>;
};

export async function generateMetadata({params}: CoinRouteProps): Promise<Metadata> {
	const {id} = await params;
	const coinId = normalizeCoinId(id);
	if (!coinId) return {title: 'Coin'};
	try {
		const coins = await getMarkets();
		const coin = coins.find((item) => item.id === coinId);
		if (!coin) return {title: 'Coin'};
		return {title: `${coin.name} (${coin.symbol.toUpperCase()}) price`, description: `${coin.name} price, market stats, and chart`};
	} catch {
		return {title: 'Coin'};
	}
}

function pageError(status: number): CoinPageError {
	if (status === 404) return 'missing';
	if (status === 429) return 'rate-limit';
	return 'generic';
}

export default async function Page({params}: CoinRouteProps) {
	const {id} = await params;
	const coinId = normalizeCoinId(id);
	if (!coinId) notFound();
	if (id !== coinId) redirect(`/coin/${coinId}`);

	let coin: CoinDetail | null = null;
	let error: CoinPageError | null = null;
	let initialChart: CoinChart | null = null;

	try {
		const coins = await getMarkets();
		const row = coins.find((item) => item.id === coinId);
		coin = row ? detailFromMarket(row) : null;
		if (!row || !coin) error = 'missing';
		else {
			try {
				initialChart = await getKucoinChart(row.symbol, '1');
			} catch {
				initialChart = null;
			}
		}
	} catch (reason) {
		error = pageError(statusOf(reason));
	}

	return (
		<div className='min-h-dvh w-full bg-white dark:bg-ocean'>
			<main className='mx-auto w-full min-w-0 max-w-screen-xl px-4 py-6 md:px-10 md:py-10'>
				<CoinPage id={coinId} coin={coin} error={error} initialChart={initialChart} />
			</main>
		</div>
	);
}
