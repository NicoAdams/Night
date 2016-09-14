import {
	map,
	concat,
	zip,
	minBy,
	range,
	forEach
} from 'lodash';
import {
	forEachPair,
	sum
} from './util/array_util';
import {
	vec,
	vecPolar
} from './geom';
import { makeRange } from './util/range';
import {
	fillShape,
	outlineShape
} from './drawing';

// Creates a poly object
export function makePolyObject(points) {
	
	// Private fields
	
	// Bounding box calculations
	
	let boundingBox = {
		xRange: makeRange(0,0),
		yRange: makeRange(0,0)
	}
	
	function calculateBoundingBox(polyObject) {
		boundingBox.xRange = polyObject.projectOnto(vec(0,1)),
		boundingBox.yRange = polyObject.projectOnto(vec(1,0))
		return boundingBox;
	}
	
	function moveBoundingBox(polyObject, moveVector) {
		boundingBox.xRange = boundingBox.xRange.shift(moveVector.dot(vec(1,0)));
		boundingBox.yRange = boundingBox.yRange.shift(moveVector.dot(vec(0,1)));
		return boundingBox;
	}
	
	function rotateBoundingBox(polyObject, angle) {
		return calculateBoundingBox(polyObject);
	}
	
	// Projection calculations
	
	let projections = [];
	
	function calculateOwnProjections(polyObject) {
		projections = [];
		forEach(polyObject.getNormals(), (n) => {
			projections.push({
				normal: n,
				projection: polyObject.projectOnto(n)
			})
		});
		return projections;
	}
	
	function moveOwnProjections(polyObject, moveVector) {
		forEach(projections, (p) => {
			p.projection = p.projection.shift(p.normal.dot(moveVector));
		});
	}
	
	function rotateOwnProjectionsAboutOrigin(polyObject, angle) {
		forEach(projections, (p) => {
			p.normal = p.normal.rotate(angle);
		})
	}
	
	function rotateOwnProjections(polyObject, angle, about) {
		const aboutCorrection = about.rotate(-angle).sub(about);
		moveOwnProjections(polyObject, aboutCorrection);
		rotateOwnProjectionsAboutOrigin(polyObject, angle, about);
	}
	
	// Public fields
	
	const polyObject = {
		points: points,
		drawColor: "WHITE",
		fillColor: null,
		withDrawColor: function(color) {
			polyObject.drawColor = color;
			return polyObject;
		},
		withFillColor: function(color) {
			polyObject.fillColor = color;
			return polyObject;
		},
		copy: function() {
			return makePolyObject(points);
		},
		toString: function(roundTo=null) {
			const pointStrings = map(polyObject.points, (p) => p.toString(roundTo));
			return "Object["+pointStrings.toString()+"]";
		},
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
		move: function(moveVector) {
			polyObject.points = map(polyObject.points,
				(p) => p.add(moveVector)
			);
			moveBoundingBox(polyObject, moveVector);
			moveOwnProjections(polyObject, moveVector);
			return polyObject;
		},
		rotate: function(angle, about=polyObject.com()) {
			polyObject.points = map(polyObject.points,
				(p) => p.rotateAbout(angle, about)
			);
			rotateBoundingBox(polyObject, angle, about);
			rotateOwnProjections(polyObject, angle, about);
			return polyObject;
		},
		getBoundingBox: function() {
			return boundingBox;
		},
		overlapsBoundingBox: function(objectOther) {
			const result = (
				boundingBox.xRange.overlaps(objectOther.getBoundingBox().xRange)
				&& boundingBox.yRange.overlaps(objectOther.getBoundingBox().yRange)
			);
			return result;
		},
		projectOnto: function(vProject) {
			if (polyObject.points.length == 0) { return null; }
			let r = null;
			forEachPair(polyObject.points, (p1, p2) => {
				const project1 = p1.projectScalar(vProject),
					  project2 = p2.projectScalar(vProject);
				if (!r) {
					r = makeRange(project1, project2);
				} else {
					const r2 = makeRange(project1, project2)
					r = r.union(r2);
				}
			});
			return r;
		},
		getNormals: function() {
			const normals = [];
			forEachPair(polyObject.points, (p1, p2) => {
				normals.push(p2.sub(p1).normal());
			});
			return normals;
		},
		getOwnProjections: function() {
			// Returns pre-calculated projections onto own normals
			return projections;
		},
		containsPoint: function(point) {
			let result = true;
			forEach(projections, (p) => {
				if (!p.projection.contains(point.projectScalar(p.normal))) {
					result = false;
					return false;
				}
			});
			return result;
		},
		registerMTV(mtv) {
			polyObject.mtvs.push(mtv)
		},
		draw: function() {
			if (polyObject.drawColor) { outlineShape(polyObject.points, polyObject.drawColor) };
			if (polyObject.fillColor) { fillShape(polyObject.points, polyObject.fillColor) };
		}
	};
	
	calculateBoundingBox(polyObject);
	calculateOwnProjections(polyObject);
	
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
	const rectObject = makePolyObject(points);
	rectObject.rotate(angle, pos);
	return rectObject;
};

export function makeRegularPolyObject(sides, com, radius, angle=0) {
	let points = range(sides);
	points = map(points, (i) => {
		const currAngle = (Math.PI * 2 / sides * i) + angle;
		return vecPolar(radius, currAngle).add(com);
	});
	return makePolyObject(points);
}

/**
 * f : object -> {drawColor: [color], fillColor: [color]}
 * @param {[type]} f [description]
 */
export function addLightingFunction(obj, f) {
	obj.getColor = f;
	return obj;
}