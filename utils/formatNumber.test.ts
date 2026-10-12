import {describe, expect, it} from 'vitest';
import {formatNumber} from './formatNumber';

describe('formatNumber', () => {
	it('formats USD with cents', () => {
		expect(formatNumber(12.5, 'usdWithCents')).toBe('$12.50');
	});

	it('formats whole dollars', () => {
		expect(formatNumber(2500, 'usdWhole')).toBe('$2,500');
	});

	it('formats a percent from the absolute value', () => {
		expect(formatNumber(-3.2, 'percent')).toBe('3.2%');
	});

	it('returns an empty string for null', () => {
		expect(formatNumber(null, 'usdWithCents')).toBe('');
		expect(formatNumber(undefined, 'percent')).toBe('');
	});
});
