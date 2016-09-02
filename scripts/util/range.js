// export function makeRange(n1, n2) {
function makeRange(n1, n2) {
	const min = Math.min(n1, n2),
		  max = Math.max(n1, n2);
	const r = {
		min: min,
		max: max,
		overlaps: function(r2) {
			return !(r.min > r2.max || r.max < r2.min);
		},
		intersect: function(r2) {
			if (!r.overlaps(r2)) {
				return null;
			}
			return makeRange(
				Math.max(r.min, r2.min),
				Math.min(r.max, r2.max)
			);
		},
		union: function(r2) {
			if (!r.overlaps(r2)) {
				return null;
			}
			return makeRange(
				Math.min(r.min, r2.min),
				Math.max(r.max, r2.max)
			);
		},
		minTranslation: function(r2) {
			// Min amount that r2 would have to shift to get off of r
			if (!r.overlaps(r2)) {
				return 0;
			}
			dPos = r2.max - r.min;
			dNeg = r2.min - r.max;
			return (
				dPos < -dNeg
				? dPos
				: dNeg
			);
		}
	};
	return r;
}