const usdWithCents = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2});
const usdWhole = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', maximumFractionDigits: 0});
const whole = new Intl.NumberFormat('en-US', {maximumFractionDigits: 0});
const percent = new Intl.NumberFormat('en-US', {maximumFractionDigits: 2, useGrouping: false});
const compactUsd = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 2});
const dayFormat = new Intl.DateTimeFormat('en-US', {month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC'});
const clockFormat = new Intl.DateTimeFormat('en-US', {month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', timeZone: 'UTC', timeZoneName: 'short'});
const hourFormat = new Intl.DateTimeFormat('en-US', {hour: 'numeric', minute: '2-digit', timeZone: 'UTC'});
const monthDayFormat = new Intl.DateTimeFormat('en-US', {month: 'short', day: 'numeric', timeZone: 'UTC'});
const monthYearFormat = new Intl.DateTimeFormat('en-US', {month: 'short', year: 'numeric', timeZone: 'UTC'});
const usdCache = new Map<string, Intl.NumberFormat>();

const formatters = {usdWithCents, usdWhole, whole};

export type NumberStyle = keyof typeof formatters | 'percent';

export const formatNumber = (value: number | null | undefined, style: NumberStyle): string => {
	if (value === null || value === undefined) return '';
	if (style === 'percent') return `${percent.format(Math.abs(value))}%`;
	return formatters[style].format(value);
};

const usdSpan = (value: number) => {
	const abs = Math.abs(value);
	if (abs === 0 || abs >= 1) return {min: 2, max: 2};
	if (abs >= 0.01) return {min: 2, max: 4};
	if (abs >= 0.0001) return {min: 2, max: 6};
	return {min: 2, max: 8};
};

const usdFormatter = (min: number, max: number) => {
	const key = `${min}-${max}`;
	const existing = usdCache.get(key);
	if (existing) return existing;
	const formatter = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', minimumFractionDigits: min, maximumFractionDigits: max});
	usdCache.set(key, formatter);
	return formatter;
};

export const formatUsd = (value: number | null | undefined): string => {
	if (value == null || !Number.isFinite(value)) return '—';
	const span = usdSpan(value);
	return usdFormatter(span.min, span.max).format(value);
};

export const formatCompactUsd = (value: number | null | undefined): string => {
	if (value == null || !Number.isFinite(value)) return '—';
	return compactUsd.format(value);
};

export const formatUsdAxis = (value: number): string => {
	if (!Number.isFinite(value)) return '';
	if (Math.abs(value) >= 1000) return compactUsd.format(value);
	return formatUsd(value);
};

export const formatSignedPercent = (value: number | null | undefined): string => {
	if (value == null || !Number.isFinite(value)) return '—';
	const body = percent.format(Math.abs(value));
	if (value > 0) return `+${body}%`;
	if (value < 0) return `-${body}%`;
	return `${body}%`;
};

const validDate = (value: string | null | undefined) => {
	if (!value) return null;
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? null : date;
};

export const formatDay = (value: string | null | undefined): string => {
	const date = validDate(value);
	return date ? dayFormat.format(date) : '—';
};

export const formatUpdated = (value: string | null | undefined): string => {
	const date = validDate(value);
	return date ? clockFormat.format(date) : '—';
};

const DAY = 24 * 60 * 60 * 1000;

export const formatChartTick = (timestamp: number, spanMs: number): string => {
	const date = new Date(timestamp);
	if (spanMs <= 2 * DAY) return hourFormat.format(date);
	if (spanMs <= 120 * DAY) return monthDayFormat.format(date);
	return monthYearFormat.format(date);
};

export const formatChartStamp = (timestamp: number, spanMs: number): string => {
	const date = new Date(timestamp);
	if (spanMs <= 2 * DAY) return clockFormat.format(date);
	return dayFormat.format(date);
};
