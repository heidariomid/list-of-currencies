import {describe, expect, it} from 'vitest';
import type {ChartPoint} from '../interfaces/ICoinDetail';
import {buildChart, downsample, indexAtX, isChartRange, seriesChange} from './chartSeries';

const point = (t: number, price: number, volume = 1): ChartPoint => ({t, price, volume});

describe('chart series', () => {
	it('accepts the public chart ranges and rejects the rest', () => {
		expect(isChartRange('1')).toBe(true);
		expect(isChartRange('365')).toBe(true);
		expect(isChartRange('max')).toBe(false);
	});

	it('keeps the first and last point when downsampling', () => {
		const points = Array.from({length: 10}, (_, index) => point(index, index));
		const sampled = downsample(points, 4);
		expect(sampled[0]).toEqual(points[0]);
		expect(sampled[sampled.length - 1]).toEqual(points[9]);
		expect(sampled.length).toBeLessThanOrEqual(4);
	});

	it('measures the change from the first price to the last', () => {
		expect(seriesChange([point(0, 100), point(1, 110)])).toBe(10);
		expect(seriesChange([point(0, 0), point(1, 10)])).toBeNull();
	});

	it('draws a rising series upward and keeps volume', () => {
		const geometry = buildChart([point(0, 10, 1), point(1, 20, 4), point(2, 15, 2)]);
		expect(geometry).not.toBeNull();
		if (!geometry) return;
		expect(geometry.coords[0].x).toBe(geometry.plot.left);
		expect(geometry.coords[2].x).toBe(geometry.plot.right);
		expect(geometry.coords[1].y).toBeLessThan(geometry.coords[0].y);
		expect(geometry.volume.length).toBeGreaterThan(0);
		expect(indexAtX(geometry.plot.left, 3, geometry.plot.left, geometry.plot.right)).toBe(0);
		expect(indexAtX(geometry.plot.right, 3, geometry.plot.left, geometry.plot.right)).toBe(2);
	});
});
