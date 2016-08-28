import {
	map
} from 'lodash';
import {
	forEachPair,
	sum
} from './util/array_util';
import { vec } from './geom';

// Creates a poly object
export function makePolyObject(points, color='WHITE') {
	const polyObject = {
		points: points,
		color: color,
		area: function() {
			// https://en.wikipedia.org/wiki/Centroid
			let total = 0;
			forEachPair(polyObject.points, (p1, p2) => {
				total += p1.x * p2.y - p1.y * p2.x;
			});
			return Math.abs(total) / 2;
		},
		com: function() {
			// https://en.wikipedia.org/wiki/Centroid
			const a = polyObject.area();
			let total = vec(0,0);
			forEachPair(polyObject.points, (p1, p2) => {
				const cross = p1.cross(p2);
				total.x += (p1.x + p2.x) * cross;
				total.y += (p1.y + p2.y) * cross;
			});
			return total.mul(1 / (6 * polyObject.area()));
		},
		move: function(change) {
			polyObject.points = map(polyObject.points,
				(p) => p.add(change)
			);
		},
		rotate: function(angle, about=polyObject.com()) {
			polyObject.points = map(polyObject.points,
				(p) => p.rotateAbout(angle, about)
			);
		}
	};
	return polyObject;
};

export function makeRectObject(pos, dim, angle=0) {
	const xDim = vec(dim.x, 0),
		  yDim = vec(0, dim.y);
	const points = [
		pos,
		pos.add(xDim),
		pos.add(dim),
		pos.add(yDim)
	];
	return makePolyObject(points);
};
