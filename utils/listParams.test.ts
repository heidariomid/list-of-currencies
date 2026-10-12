import {describe, expect, it} from 'vitest';
import {parseListParams, serializeListParams} from './listParams';

describe('list params', () => {
	it('omits page 1, an empty query, and the default rank sort', () => {
		expect(serializeListParams({page: 1, q: '', sort: 'market_cap_rank', dir: 'asc'})).toBe('');
		expect(serializeListParams({page: 1, q: '   ', sort: 'market_cap_rank', dir: 'asc'})).toBe('');
	});

	it('keeps a shared link for page, search, and sort', () => {
		expect(serializeListParams({page: 2, q: 'sol', sort: 'current_price', dir: 'desc'})).toBe('page=2&q=sol&sort=current_price&dir=desc');
	});

	it('drops an ascending direction because it is the default', () => {
		expect(serializeListParams({page: 3, q: '', sort: 'market_cap', dir: 'asc'})).toBe('page=3&sort=market_cap');
	});

	it('falls back when the query string is invalid', () => {
		expect(parseListParams(new URLSearchParams('page=0&sort=nope&dir=up'))).toEqual({
			page: 1,
			q: '',
			sort: 'market_cap_rank',
			dir: 'asc',
		});
	});
});
