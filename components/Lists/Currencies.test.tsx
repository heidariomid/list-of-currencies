// @vitest-environment jsdom
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {cleanup, fireEvent, render, screen} from '@testing-library/react';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import Currencies from './Currencies';

const coins = Array.from({length: 15}, (_, index) => {
	const rank = index + 1;
	return {
		id: `coin-${rank}`,
		symbol: `c${rank}`,
		name: `Coin ${rank}`,
		image: '/coin.png',
		current_price: 100 - index,
		market_cap: 1000 - index,
		market_cap_rank: rank,
		price_change_24h: 1,
		price_change_percentage_24h: 1,
		price_change_percentage_7d_in_currency: 1,
		total_volume: 10,
		circulating_supply: 10,
	};
});

const navigation = vi.hoisted(() => ({
	search: '',
	push: vi.fn(),
	replace: vi.fn(),
}));

vi.mock('next/navigation', () => ({
	usePathname: () => '/',
	useSearchParams: () => new URLSearchParams(navigation.search),
	useRouter: () => ({
		push: (href: string, options?: {scroll?: boolean}) => {
			navigation.push(href, options);
			navigation.search = href.includes('?') ? href.slice(href.indexOf('?') + 1) : '';
		},
		replace: (href: string, options?: {scroll?: boolean}) => {
			navigation.replace(href, options);
			navigation.search = href.includes('?') ? href.slice(href.indexOf('?') + 1) : '';
		},
	}),
}));

vi.mock('./TBodyCurrencies', () => ({
	default: ({currency}: {currency: {name: string}}) => (
		<tr>
			<td>{currency.name}</td>
		</tr>
	),
}));

describe('Currencies', () => {
	beforeEach(() => {
		navigation.search = '';
		navigation.push.mockClear();
		vi.stubGlobal(
			'fetch',
			vi.fn().mockResolvedValue({
				ok: true,
				status: 200,
				json: async () => coins,
			}),
		);
	});

	afterEach(() => {
		cleanup();
		vi.unstubAllGlobals();
	});

	it('fetches the top coins once and does not call the API again when the page changes', async () => {
		const queryClient = new QueryClient({defaultOptions: {queries: {retry: false}}});
		const list = (
			<QueryClientProvider client={queryClient}>
				<Currencies />
			</QueryClientProvider>
		);
		const {rerender} = render(list);

		expect(await screen.findByText('Coin 1')).toBeTruthy();
		expect(screen.queryByText('Coin 11')).toBeNull();
		expect(fetch).toHaveBeenCalledTimes(1);
		expect(vi.mocked(fetch).mock.calls[0][0]).toBe('/api/markets');

		fireEvent.click(screen.getByRole('button', {name: '2'}));
		rerender(
			<QueryClientProvider client={queryClient}>
				<Currencies />
			</QueryClientProvider>,
		);

		expect(screen.getByText('Coin 11')).toBeTruthy();
		expect(screen.queryByText('Coin 1')).toBeNull();
		expect(navigation.push).toHaveBeenCalledWith('/?page=2', {scroll: false});
		expect(fetch).toHaveBeenCalledTimes(1);
	});
});
