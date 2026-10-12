import {describe, expect, it} from 'vitest';
import {pageItems} from './pageItems';

describe('pageItems', () => {
	it('shows the ends and an ellipsis on the first of 25 pages', () => {
		expect(pageItems(1, 25)).toEqual([1, 2, 3, 'ellipsis', 23, 24, 25]);
	});

	it('keeps the current page and both ellipses in the middle', () => {
		expect(pageItems(12, 25)).toEqual([1, 2, 3, 'ellipsis', 11, 12, 13, 'ellipsis', 23, 24, 25]);
	});

	it('lists every page when the total is 7 or fewer', () => {
		expect(pageItems(4, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
		expect(pageItems(2, 3)).toEqual([1, 2, 3]);
	});
});
