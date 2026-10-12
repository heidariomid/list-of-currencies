const usdWithCents = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2});
const usdWhole = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', maximumFractionDigits: 0});
const whole = new Intl.NumberFormat('en-US', {maximumFractionDigits: 0});
const percent = new Intl.NumberFormat('en-US', {maximumFractionDigits: 2, useGrouping: false});

const formatters = {usdWithCents, usdWhole, whole};

export type NumberStyle = keyof typeof formatters | 'percent';

export const formatNumber = (value: number | null | undefined, style: NumberStyle): string => {
	if (value === null || value === undefined) return '';
	if (style === 'percent') return `${percent.format(Math.abs(value))}%`;
	return formatters[style].format(value);
};
