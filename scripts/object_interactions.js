import {
	map,
	sortBy,
	meanBy,
	forEach
} from 'lodash';
import { forEachPair } from './util/array_util';
import { makeRange } from './util/range';
import { makePolyObject } from './object';

/**
 * Functions regarding the interactions of shapes
 * 
 * shape : [vec, ...]
 * segment : [vec, vec]
 */

function vertical(segment) {
	return segment[0].x == segment[1].x;
}

function diff(segment) {
	return segment[1].sub(segment[0]);
}

function slope(segment) {
	return (vertical(segment) ? NaN : diff(segment).slope());
}

function xRange(segment) {
	return makeRange(segment[0].x, segment[1].x);
}

function yRange(segment) {
	return makeRange(segment[0].y, segment[1].y);
}

/**
 * Returns the value of the line defined by segment at point x
 */
function valueAt(segment, x) {
	if (vertical(segment)) {
		return NaN;
	}
	return (x - segment[0].x) * diff(segment).slope() + segment[0].y;
}

/** 
 * Returns +1 if segment goes right, -1 if left, 0 if vertical
 */
function leftRight(segment) {
	return Math.sign(diff(segment).x);
}

/**
 * Returns +1 if line went over point, -1 if under, 0 if neither
 * Uses y-axis for measurement of height
 */
function overUnder(segment, point) {
	// This condition excludes both lines out of range and vertical lines (NaN slopes)
	if ( !xRange(segment).contains(point.x) ) {
		return 0;
	}
	return valueAt(segment, point.x) > point.y ? 1 : -1
}

/**
 * Determines whether the shape contains the point. Inclusive on bottom edge, exclusive on top
 * WARNING Slower than object.contains, I'm just keeping it here because I don't feel like deleting it
 */
export function contains(shape, point) {
	let parity = 0;
	forEachPair(shape, (p1, p2) => {
		parity += leftRight([p1, p2]) * overUnder([p1, p2], point);
	});
	return parity != 0;
}

/**
 * Returns the y-intercept of segment, treating it as though it is a line
 */
function lineYIntercept(segment) {
	return valueAt(segment, 0);
}

/** 
 * Returns the x-intercept of segment, or NaN if segment doesn't cross the x-axis
 */
function segmentXIntercept(segment) {
	if ( !yRange(segment).contains(0) ) {
		return NaN;
	}
	if (vertical(segment)) {
		return segment[0].x;
	}
	// Literally just use y = mx + b
	const m = slope(segment);
	const b = lineYIntercept(segment);
	return - b / m;
}

function transformVec(v, moveBy, rotateBy) {
	return v.add(moveBy).rotate(rotateBy);
}

function untransformVec(v, moveBy, rotateBy) {
	return v.rotate(-rotateBy).add(moveBy.mul(-1));
}

/**
 * Roots a segment at (0,0) and sets its slope to 0. Applies this transform to all segments in segmentList
 */
export function getIntersect(segment1, segment2) {
	const moveBy = segment1[0].mul(-1),						// Roots segment1 at origin
		  rotateBy = -(diff(segment1).angle() + Math.PI/2);	// Rotates segment to y-axis
	
	// Transforms segment1 to be flush with the y axis
	const segment2Trans = map(segment2, (p) => transformVec(p, moveBy, rotateBy));
	
	// No y intercept exists
	if ( !xRange(segment2Trans).contains(0) ) {
		return null;
	}
	
	// y intercept out of bounds
	const testYIntercept = lineYIntercept(segment2Trans);
	const maxYIntercept = transformVec(segment1[1], moveBy, rotateBy).y;
	if (!makeRange(0, maxYIntercept).contains(testYIntercept)) {
		return null;
	}
	
	// Transforms a valid y intercept back to original coords
	return untransformVec(vec(0, testYIntercept), moveBy, rotateBy);
}

/**
 * Returns all points of obj1 contained in obj2
 */
export function getAllPointsContained(obj1, obj2) {
	const contained = [];
	forEach(obj1.points, (p) => {
		if (obj2.containsPoint(p)) {
			contained.push(p);
		}
	});
	return contained;
}

export function getAllIntersects(obj1, obj2) {
	const intersects = [];
	forEachPair(obj1.points, (p11, p12) => {
		const s1 = [p11, p12];
		forEachPair(obj2.points, (p21, p22) => {
			const s2 = [p21, p22];
			// Some bounding box stuff that may/may not speed this algorithm up
			if( !xRange(s1).overlaps(xRange(s2)) || 
				!yRange(s1).overlaps(yRange(s2))) {
				return;
			}
			// Gets the intersect and adds it if valid
			const intersect = getIntersect(s1, s2);
			if ( intersect ) {
				intersects.push(intersect)
			}
		})
	})
	return intersects;
}

/**
 * Returns the object of overlap
 * METHOD: Gets all intersects & contained points and sorts by angle about the average
 */
export function getOverlapObject(obj1, obj2) {
	if(obj1.overlapsBoundingBox(obj2)) {
		let overlapPoints = [];
		overlapPoints = overlapPoints.concat(getAllPointsContained(obj1, obj2));
		overlapPoints = overlapPoints.concat(getAllPointsContained(obj2, obj1));
		overlapPoints = overlapPoints.concat(getAllIntersects(obj1, obj2));
		
		// If only 2 points, not enough to make an overlap shape (not sure how this could happen, but it could be an edge case)
		if (overlapPoints.length <= 2) { return null; }
		
		const center = vec(
			meanBy(overlapPoints, (p) => (p.x)),
			meanBy(overlapPoints, (p) => (p.y))
		);
		const convexOverlapShape = sortBy(overlapPoints, (p) => {
			return p.sub(center).angle();
		});
		return makePolyObject(convexOverlapShape);
	}
}
