import {SortDir, SortKey} from './listParams';

type SortRow = Partial<Record<SortKey, number | null>>;

export const sortCurrencies = <T extends SortRow>(items: readonly T[], sort: SortKey, dir: SortDir): T[] => {
	const factor = dir === 'asc' ? 1 : -1;
	return items.slice().sort((a, b) => {
		const av = a[sort];
		const bv = b[sort];
		if (av == null || bv == null || Number.isNaN(av) || Number.isNaN(bv)) {
			const avMissing = av == null || Number.isNaN(av);
			const bvMissing = bv == null || Number.isNaN(bv);
			if (avMissing && bvMissing) return 0;
			return avMissing ? 1 : -1;
		}
		if (av === bv) return 0;
		return (av - bv) * factor;
	});
};
