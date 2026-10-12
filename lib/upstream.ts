export class UpstreamError extends Error {
	status: number;

	constructor(status: number) {
		super('CoinGecko request failed');
		this.name = 'UpstreamError';
		this.status = status;
	}
}

export function statusOf(error: unknown) {
	if (error instanceof UpstreamError) return error.status;
	if (typeof error === 'object' && error !== null && 'status' in error && typeof error.status === 'number') return error.status;
	return 502;
}
