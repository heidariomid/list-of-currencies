'use client';

import {useId, useMemo, useState} from 'react';
import {formatChartStamp, formatChartTick, formatCompactUsd, formatSignedPercent, formatUsd, formatUsdAxis} from '../../utils/formatNumber';
import {buildChart, CHART_HEIGHT, CHART_RANGES, CHART_WIDTH, type ChartRange, downsample, indexAtX, seriesChange} from '../../utils/chartSeries';
import type {ChartPoint} from '../../interfaces/ICoinDetail';

const UP = '#22c55e';
const DOWN = '#ef4444';
const FLAT = '#6b7280';

type PriceChartProps = {
	name: string;
	points: ChartPoint[];
	fallbackPrice: number;
	range: ChartRange;
	onRange: (range: ChartRange) => void;
	loading: boolean;
	error: 'rate-limit' | 'unavailable' | 'generic' | null;
	onRetry: () => void;
};

const tone = (value: number | null) => {
	if (value == null || value === 0) return 'text-gray-500 dark:text-zinc-400';
	return value > 0 ? 'text-green-500' : 'text-red-500';
};

function RangeButtons({range, onRange}: {range: ChartRange; onRange: (range: ChartRange) => void}) {
	return (
		<div role='group' aria-label='Time range' className='inline-flex flex-wrap gap-1 rounded-lg bg-gray-100 p-1 dark:bg-black/25'>
			{CHART_RANGES.map((item) => {
				const selected = item.id === range;
				return (
					<button
						key={item.id}
						type='button'
						aria-pressed={selected}
						onClick={() => onRange(item.id)}
						className={`rounded-md px-2.5 py-1 text-xs font-semibold ${selected ? 'bg-white text-gray-900 shadow-sm dark:bg-zinc-600 dark:text-white' : 'text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white'}`}
					>
						{item.label}
					</button>
				);
			})}
		</div>
	);
}

const PriceChart = ({name, points, fallbackPrice, range, onRange, loading, error, onRetry}: PriceChartProps) => {
	const fillId = `price-fill-${useId().replace(/:/g, '')}`;
	const series = useMemo(() => downsample(points, 480), [points]);
	const geometry = useMemo(() => buildChart(series), [series]);
	const change = seriesChange(series);
	const seriesKey = series.length > 1 ? `${range}:${series[0].t}:${series[series.length - 1].t}` : range;
	const [hoverState, setHoverState] = useState<{key: string; index: number} | null>(null);
	const hoverIndex = hoverState && hoverState.key === seriesKey ? hoverState.index : null;
	const setHover = (index: number | null) => setHoverState(index == null ? null : {key: seriesKey, index});
	const span = series.length > 1 ? series[series.length - 1].t - series[0].t : 0;
	const hovered = hoverIndex != null ? series[hoverIndex] : null;
	const active = hovered ?? series[series.length - 1];
	const color = change == null || change === 0 ? FLAT : change > 0 ? UP : DOWN;
	const rangeLabel = CHART_RANGES.find((item) => item.id === range)?.label ?? '1D';
	const message =
		error === 'rate-limit' ? 'Too many requests. Wait a minute, then try again.' : error === 'unavailable' ? 'This coin has no exchange chart.' : error ? 'The chart could not be loaded.' : '';

	return (
		<section className='min-w-0 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-zinc-600 dark:bg-ocean md:p-5'>
			<div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
				<div>
					<p className='text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-zinc-400'>
						{hovered ? formatChartStamp(hovered.t, span) : `${rangeLabel} price`}
					</p>
					<p className='mt-1 text-2xl font-semibold tabular-nums text-gray-900 dark:text-white'>{formatUsd(active?.price ?? fallbackPrice)}</p>
					<p className={`mt-1 text-sm font-medium tabular-nums ${hovered ? 'text-gray-500 dark:text-zinc-400' : tone(change)}`}>
						{hovered ? `Vol ${formatCompactUsd(hovered.volume)}` : formatSignedPercent(change)}
					</p>
				</div>
				<RangeButtons range={range} onRange={onRange} />
			</div>
			<div className='relative mt-4'>
				{message && (
					<p role='alert' className='mb-3 text-sm text-gray-600 dark:text-zinc-300'>
						{message}
						{error !== 'unavailable' && (
							<button type='button' onClick={onRetry} className='ml-1 font-medium text-primary'>
								Try again
							</button>
						)}
					</p>
				)}
				{geometry ? (
					<>
						<svg
							viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
							role='img'
							aria-label={`${name} ${rangeLabel} chart, ${formatSignedPercent(change)}`}
							tabIndex={0}
							className='block h-auto w-full touch-pan-y rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500'
							onPointerLeave={() => setHover(null)}
							onBlur={() => setHover(null)}
							onPointerMove={(event) => {
								const bounds = event.currentTarget.getBoundingClientRect();
								if (bounds.width === 0) return;
								const x = ((event.clientX - bounds.left) / bounds.width) * CHART_WIDTH;
								setHover(indexAtX(x, series.length, geometry.plot.left, geometry.plot.right));
							}}
							onKeyDown={(event) => {
								if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight' && event.key !== 'Home' && event.key !== 'End') return;
								event.preventDefault();
								if (event.key === 'Home') return setHover(0);
								if (event.key === 'End') return setHover(series.length - 1);
								const current = hoverIndex ?? series.length - 1;
								const next = event.key === 'ArrowLeft' ? current - 1 : current + 1;
								setHover(Math.max(0, Math.min(series.length - 1, next)));
							}}
						>
							<defs>
								<linearGradient id={fillId} x1='0' y1='0' x2='0' y2='1'>
									<stop offset='0%' stopColor={color} stopOpacity='0.28' />
									<stop offset='100%' stopColor={color} stopOpacity='0' />
								</linearGradient>
							</defs>
							{geometry.yTicks.map((tick, index) => (
								<g key={index}>
									<line x1={geometry.plot.left} x2={geometry.plot.right} y1={tick.y} y2={tick.y} stroke='currentColor' strokeWidth='1' className='text-gray-200 dark:text-zinc-700' />
									<text x={geometry.plot.right + 10} y={tick.y + 4} fill='currentColor' fontSize='12' className='text-gray-500 dark:text-zinc-400'>
										{formatUsdAxis(tick.price)}
									</text>
								</g>
							))}
							{geometry.volume && <path d={geometry.volume} fill={color} opacity='0.18' />}
							<path d={geometry.area} fill={`url(#${fillId})`} />
							<path d={geometry.line} fill='none' stroke={color} strokeWidth='2.25' strokeLinejoin='round' strokeLinecap='round' />
							<circle cx={geometry.end.x} cy={geometry.end.y} r='8' fill={color} opacity='0.18' />
							<circle cx={geometry.end.x} cy={geometry.end.y} r='3.5' fill={color} />
							{hoverIndex != null && geometry.coords[hoverIndex] && (
								<g>
									<line
										x1={geometry.coords[hoverIndex].x}
										x2={geometry.coords[hoverIndex].x}
										y1={geometry.plot.top}
										y2={CHART_HEIGHT - 28}
										stroke={color}
										strokeDasharray='3 3'
										strokeWidth='1'
									/>
									<circle cx={geometry.coords[hoverIndex].x} cy={geometry.coords[hoverIndex].y} r='4.5' fill={color} />
								</g>
							)}
							{geometry.xTicks.map((tick, index) => (
								<text key={index} x={tick.x} y={CHART_HEIGHT - 8} textAnchor={tick.anchor} fill='currentColor' fontSize='12' className='text-gray-500 dark:text-zinc-400'>
									{formatChartTick(tick.t, span)}
								</text>
							))}
						</svg>
						<p className='mt-1 text-right text-xs text-gray-400 dark:text-zinc-500'>Times in UTC</p>
						{hovered && hoverIndex != null && geometry.coords[hoverIndex] && (
							<div
								className='pointer-events-none absolute top-3 z-10 rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-xs shadow-sm dark:border-zinc-600 dark:bg-ocean'
								style={{
									left: `${(geometry.coords[hoverIndex].x / CHART_WIDTH) * 100}%`,
									transform: geometry.coords[hoverIndex].x > CHART_WIDTH * 0.62 ? 'translateX(calc(-100% - 8px))' : 'translateX(8px)',
								}}
							>
								<p className='text-gray-500 dark:text-zinc-400'>{formatChartStamp(hovered.t, span)}</p>
								<p className='font-semibold tabular-nums text-gray-900 dark:text-white'>{formatUsd(hovered.price)}</p>
							</div>
						)}
					</>
				) : error ? (
					<div className='flex aspect-[2/1] items-center justify-center rounded-md bg-gray-50 dark:bg-black/20'>
						<span className='sr-only'>Chart unavailable</span>
					</div>
				) : (
					<div role='status' className='aspect-[2/1] animate-pulse rounded-md bg-gray-100 dark:bg-zinc-700' aria-busy={loading}>
						<span className='sr-only'>Loading chart</span>
					</div>
				)}
			</div>
		</section>
	);
};

export default PriceChart;
