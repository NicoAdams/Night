import { limit } from './util/util';

export function vec(x, y) {
	const v = {
		x: x,
		y: y,
		0: x,
		1: y,
		map: function(f) {
			return vec(f(v.x), f(v.y));
		},
		map2: function(v2, f) {
			return vec(f(v.x, v2.x), f(v.y, v2.y));
		},
		inv: function() {
			return vec(v.y, v.x);
		},
		dot: function(v2) {
			return v.x * v2.x + v.y * v2.y;
		},
		len: function() {
			return Math.sqrt(v.dot(v));
		},
		cross: function(v2) {
			return v.x * v2.y - v.y * v2.x;
		},
		mul: function(n) {
			return v.map((i) => {return i * n;});
		},
		add: function(v2) {
			return v.map2(v2, (i, i2) => {return i + i2;});
		},
		sub: function(v2) {
			return v.add(v2.mul(-1));
		},
		rotate: function(angle) {
			return vec(
				v.x * Math.cos(angle) - v.y * Math.sin(angle),
				v.x * Math.sin(angle) + v.y * Math.cos(angle)
			);
		},
		rotateAbout: function(angle, v2) {
			const vd = v.sub(v2);
			const vdRot = vd.rotate(angle);
			return v.sub(vd).add(vdRot);
		},
		limit: function(vLim) {
			return vec(limit(v.x, vLim.x), limit(v.y, vLim.y));
		}
	};
	return v;
}