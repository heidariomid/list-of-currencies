export const pageItems = (current: number, totalPages: number): Array<number | 'ellipsis'> => {
	if (totalPages <= 7) {
		return Array.from({length: totalPages}, (_, index) => index + 1);
	}
	const pages = new Set<number>([1, 2, 3, totalPages - 2, totalPages - 1, totalPages]);
	for (let page = current - 1; page <= current + 1; page++) {
		if (page >= 1 && page <= totalPages) pages.add(page);
	}
	const sorted = [...pages].sort((a, b) => a - b);
	const items: Array<number | 'ellipsis'> = [];
	sorted.forEach((page, index) => {
		if (index > 0 && page - sorted[index - 1] > 1) items.push('ellipsis');
		items.push(page);
	});
	return items;
};
