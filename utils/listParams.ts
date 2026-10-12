export const SORT_KEYS = ['market_cap_rank', 'current_price', 'price_change_percentage_24h', 'price_change_percentage_7d_in_currency', 'market_cap'] as const;

export type SortKey = (typeof SORT_KEYS)[number];
export type SortDir = 'asc' | 'desc';

export const DEFAULT_SORT: SortKey = 'market_cap_rank';
export const DEFAULT_DIR: SortDir = 'asc';

export type ListParams = {
	page: number;
	q: string;
	sort: SortKey;
	dir: SortDir;
};

const isSortKey = (value: string | null): value is SortKey => SORT_KEYS.some((key) => key === value);

export const parseListParams = (searchParams: {get(name: string): string | null}): ListParams => {
	const pageRaw = Number(searchParams.get('page'));
	const sortRaw = searchParams.get('sort');
	return {
		page: Number.isInteger(pageRaw) && pageRaw > 1 ? pageRaw : 1,
		q: searchParams.get('q') ?? '',
		sort: isSortKey(sortRaw) ? sortRaw : DEFAULT_SORT,
		dir: searchParams.get('dir') === 'desc' ? 'desc' : DEFAULT_DIR,
	};
};

export const serializeListParams = (state: ListParams): string => {
	const params = new URLSearchParams();
	if (state.page > 1) params.set('page', String(state.page));
	if (state.q.trim() !== '') params.set('q', state.q);
	if (state.sort !== DEFAULT_SORT) params.set('sort', state.sort);
	if (state.dir !== DEFAULT_DIR) params.set('dir', state.dir);
	return params.toString();
};

export const listHref = (pathname: string, state: ListParams): string => {
	const query = serializeListParams(state);
	return query ? `${pathname}?${query}` : pathname;
};
