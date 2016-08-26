export function limit(n, l) {
	// Limits the absolute value of n by l
	const lAbs = Math.abs(l);
	return Math.min(Math.max(n, -lAbs), lAbs);
}

export function round(n, exponent) {
	const base = Math.round(Math.pow(10, Math.abs(exponent)));
	if (exponent > 0) {
		return Math.round(n / base) * base;
	}
	else {
		return Math.round(n * base) / base;
	}
}
