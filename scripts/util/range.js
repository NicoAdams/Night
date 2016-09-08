import { round } from './util';

export function makeRange(n1, n2) {
	const min = Math.min(n1, n2),
		  max = Math.max(n1, n2);
	const r = {
		min: min,
		max: max,
		round: function(roundTo) {
			return makeRange(round(r.min, roundTo), round(r.max, roundTo));
		},
		toString: function(roundTo=null) {
			let rToString = r;
			if (roundTo) {
				rToString = r.round(roundTo);
			}
			return "r("+rToString.min+" -> "+rToString.max+")";
		},
		shift: function(shiftBy) {
			return makeRange(r.min + shiftBy, r.max + shiftBy);
		},
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
			const dPos = r2.max - r.min;
			const dNeg = r2.min - r.max;
			return (
				dPos < -dNeg
				? dPos
				: dNeg
			);
		}
	};
	return r;
}
