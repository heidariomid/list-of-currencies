import {describe, expect, it} from 'vitest';
import {formatCompactUsd, formatDay, formatNumber, formatSignedPercent, formatUsd} from './formatNumber';

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

describe('detail formatters', () => {
	it('keeps cents on dollar prices and extra places on tiny ones', () => {
		expect(formatUsd(12.5)).toBe('$12.50');
		expect(formatUsd(0.5)).toBe('$0.50');
		expect(formatUsd(0.00001234)).toBe('$0.00001234');
		expect(formatUsd(null)).toBe('—');
	});

	it('compacts large dollar amounts and signs percents', () => {
		expect(formatCompactUsd(1_655_935_727_995)).toBe('$1.66T');
		expect(formatSignedPercent(2)).toBe('+2%');
		expect(formatSignedPercent(-1.665)).toBe('-1.67%');
	});

	it('formats an all-time date in UTC', () => {
		expect(formatDay('2025-10-06T10:57:42.000Z')).toBe('Oct 6, 2025');
	});
});
