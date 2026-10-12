import type {ChartPoint} from '../interfaces/ICoinDetail';

export const CHART_RANGES = [
	{id: '1', label: '1D'},
	{id: '7', label: '7D'},
	{id: '30', label: '1M'},
	{id: '90', label: '3M'},
	{id: '365', label: '1Y'},
] as const;

export type ChartRange = (typeof CHART_RANGES)[number]['id'];

export const CHART_WIDTH = 800;
export const CHART_HEIGHT = 400;

const PAD = {top: 16, right: 96, bottom: 28, left: 8};
const VOLUME_BAND = 56;
const VOLUME_GAP = 12;

export function isChartRange(value: string): value is ChartRange {
	return CHART_RANGES.some((range) => range.id === value);
}

export function downsample<T>(points: T[], max: number): T[] {
	if (max < 2 || points.length <= max) return points;
	const last = points.length - 1;
	const result: T[] = [];
	let previous = -1;
	for (let index = 0; index < max; index += 1) {
		const pointIndex = Math.round((index * last) / (max - 1));
		if (pointIndex === previous) continue;
		previous = pointIndex;
		result.push(points[pointIndex]);
	}
	return result;
}

export function seriesChange(points: {price: number}[]): number | null {
	if (points.length < 2) return null;
	const start = points[0].price;
	const end = points[points.length - 1].price;
	if (!Number.isFinite(start) || start === 0 || !Number.isFinite(end)) return null;
	return ((end - start) / start) * 100;
}

export type ChartGeometry = {
	line: string;
	area: string;
	volume: string;
	coords: {x: number; y: number}[];
	yTicks: {y: number; price: number}[];
	xTicks: {x: number; t: number; anchor: 'start' | 'middle' | 'end'}[];
	plot: {left: number; right: number; top: number; bottom: number};
	end: {x: number; y: number};
};

export function indexAtX(x: number, count: number, left: number, right: number): number | null {
	if (count < 1 || right <= left) return null;
	if (x < left || x > right) return null;
	if (count === 1) return 0;
	const ratio = (x - left) / (right - left);
	return Math.min(count - 1, Math.max(0, Math.round(ratio * (count - 1))));
}

const round = (value: number) => Math.round(value * 10) / 10;

export function buildChart(points: ChartPoint[]): ChartGeometry | null {
	if (points.length < 2) return null;

	const plot = {
		left: PAD.left,
		right: CHART_WIDTH - PAD.right,
		top: PAD.top,
		bottom: CHART_HEIGHT - PAD.bottom - VOLUME_BAND - VOLUME_GAP,
	};
	const volumeBottom = CHART_HEIGHT - PAD.bottom;
	const volumeTop = plot.bottom + VOLUME_GAP;
	const prices = points.map((point) => point.price);
	let min = Math.min(...prices);
	let max = Math.max(...prices);
	if (!Number.isFinite(min) || !Number.isFinite(max)) return null;
	if (min === max) {
		const pad = Math.abs(min) * 0.01 || 1;
		min -= pad;
		max += pad;
	} else {
		const pad = (max - min) * 0.08;
		min -= pad;
		max += pad;
	}

	const plotWidth = plot.right - plot.left;
	const plotHeight = plot.bottom - plot.top;
	const xAt = (index: number) => plot.left + (index / (points.length - 1)) * plotWidth;
	const yAt = (price: number) => plot.top + ((max - price) / (max - min)) * plotHeight;
	const coords = points.map((point, index) => ({x: xAt(index), y: yAt(point.price)}));
	const line = coords.map((coord, index) => `${index === 0 ? 'M' : 'L'}${round(coord.x)} ${round(coord.y)}`).join(' ');
	const last = coords[coords.length - 1];
	const first = coords[0];
	const area = `${line} L${round(last.x)} ${round(plot.bottom)} L${round(first.x)} ${round(plot.bottom)} Z`;

	const maxVolume = Math.max(...points.map((point) => point.volume), 0);
	let volume = '';
	if (maxVolume > 0) {
		const volumeCoords = points.map((point, index) => ({
			x: xAt(index),
			y: volumeBottom - (point.volume / maxVolume) * (volumeBottom - volumeTop),
		}));
		const volumeLine = volumeCoords.map((coord) => `L${round(coord.x)} ${round(coord.y)}`).join(' ');
		volume = `M${round(volumeCoords[0].x)} ${round(volumeBottom)} ${volumeLine} L${round(volumeCoords[volumeCoords.length - 1].x)} ${round(volumeBottom)} Z`;
	}

	const yTicks = Array.from({length: 4}, (_, index) => {
		const price = max - ((max - min) * index) / 3;
		return {y: yAt(price), price};
	});
	const xTicks = Array.from({length: 4}, (_, index) => {
		const pointIndex = Math.round((index * (points.length - 1)) / 3);
		const anchor = index === 0 ? 'start' : index === 3 ? 'end' : 'middle';
		return {x: xAt(pointIndex), t: points[pointIndex].t, anchor} as const;
	});

	return {line, area, volume, coords, yTicks, xTicks, plot, end: last};
}
