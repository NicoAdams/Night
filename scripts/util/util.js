export function limit(n, l) {
	// Limits the absolute value of n by l
	const lAbs = Math.abs(l);
	return Math.min(Math.max(n, -lAbs), lAbs);
}