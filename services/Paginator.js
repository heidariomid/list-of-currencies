export const Paginator = (items, page, perPage) => {
	page = page || 1;
	perPage = perPage || 10;
	const offset = (page - 1) * perPage;

	let paginatedItems = [],
		total_pages = 0;

	(paginatedItems = items?.slice(offset)?.slice(0, perPage)), (total_pages = Math.ceil(items?.length / perPage));

	return {
		page: page,
		perPage: perPage,
		prevPage: page - 1 ? page - 1 : null,
		nextPage: total_pages > page ? page + 1 : null,
		totalItem: items?.length,
		totalPages: total_pages,
		data: paginatedItems,
	};
};
