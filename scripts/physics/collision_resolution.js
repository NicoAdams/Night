import {
	zip,
	forEach,
	map
} from 'lodash';
import { vec } from '../geom';
import { makeCollision } from './collision';

/**
 * Returns an array of form 
 * [{normal: vec, projection1: range, projection2: range}, ...]
 */
// export function getProjectionPairs(o1, o2) {
// 	const normals = o1.getNormals().concat(o2.getNormals());
// 	const pairs = map(normals, (n) => {
// 		return {
// 			normal: n,
// 			projection1: o1.projectOnto(n), 
// 			projection2: o2.projectOnto(n)
// 		};
// 	});
// 	return pairs;
// }

export function getProjectionPairs(o1, o2) {
	const normals1 = o1.getNormals(),
		  normals2 = o2.getNormals();
	let pairs = [];
	pairs = pairs.concat(map(o1.getOwnProjections(), (p) => {
		return {
			normal: p.normal,
			projection1: p.projection,
			projection2: o2.projectOnto(p.normal)
		}
	}));
	pairs = pairs.concat(map(o2.getOwnProjections(), (p) => {
		return {
			normal: p.normal,
			projection1: o2.projectOnto(p.normal),
			projection2: p.projection
		}
	}));
	return pairs;
}

export function colliding(o1, o2) {
	let areColliding = true;
	forEach(getProjectionPairs(o1, o2), (pair) => {
		if (!pair.projection1.intersect(pair.projection2)) {
			areColliding = false;
			return false;
		}
	});
	return areColliding;
}

/**
 * Returns the MTV required to translate o2 off of o1
 */
export function getMTV(o1, o2) {
	let minTranslationDistance = Infinity,
		minTranslation = 0,
		mtv = vec(0,0);
	forEach(getProjectionPairs(o1, o2), (pair) => {
		const currMinTranslation = pair.projection1.minTranslation(pair.projection2);
		if (Math.abs(currMinTranslation) < minTranslationDistance) {
			minTranslation = currMinTranslation;
			minTranslationDistance = Math.abs(currMinTranslation);
			mtv = pair.normal.mul(-minTranslation);
		}
		if (minTranslationDistance == 0) { return false; }
	});
	return mtv;
}

export function detectAndResolveCollisionStaticDynamic(staticObj, dynamicObj) {
	if (staticObj.overlapsBoundingBox(dynamicObj)) {
		const mtv = getMTV(staticObj, dynamicObj);
		dynamicObj.move(mtv);
		dynamicObj.registerCollision(makeCollision(mtv, staticObj));
		if (!mtv.equals(vec(0,0))) {
			return true;
		}
	}
	return false;
}
