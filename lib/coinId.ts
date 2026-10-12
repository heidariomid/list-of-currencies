const COIN_ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function normalizeCoinId(id: string): string | null {
	const normalized = id.trim().toLowerCase();
	if (normalized.length === 0 || normalized.length > 80) return null;
	return COIN_ID.test(normalized) ? normalized : null;
}
