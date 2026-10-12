'use client';

import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {listHref, parseListParams, SortKey} from '../utils/listParams';

export const useListParams = () => {
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const router = useRouter();
	const state = parseListParams(searchParams);

	const write = (next: typeof state, method: 'push' | 'replace') => {
		const href = listHref(pathname, next);
		if (href === listHref(pathname, state)) return;
		if (method === 'push') router.push(href, {scroll: false});
		else router.replace(href, {scroll: false});
	};

	const setSort = (sort: SortKey) => {
		const dir = state.sort === sort && state.dir === 'asc' ? 'desc' : state.sort === sort ? 'asc' : 'desc';
		write({...state, sort, dir, page: 1}, 'push');
	};

	return {
		...state,
		setPage: (page: number) => write({...state, page}, 'push'),
		setQuery: (q: string) => write({...state, q, page: 1}, 'replace'),
		setSort,
	};
};
