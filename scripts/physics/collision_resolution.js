import {
	zip,
	forEach,
	map
} from 'lodash';
import { vec } from '../geom';

/**
 * Returns an array of form 
 * [{normal: vec, projection1: range, projection2: range}, ...]
 */
export function getProjectionPairs(o1, o2) {
	const normals = o1.getNormals().concat(o2.getNormals());
	const pairs = map(normals, (n) => {
		return {
			normal: n,
			projection1: o1.projectOnto(n), 
			projection2: o2.projectOnto(n)
		};
	});
	return pairs;
}

export function colliding(o1, o2) {
	let areColliding = true;
	forEach(getProjectionPairs(o1, o2), (pair) => {
		if (!pair.projection1.intersect(pair.projection2)) {
			areColliding = false;
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
		if (currMinTranslation == 0) { 
			return;
		}		
		if (Math.abs(currMinTranslation) < minTranslationDistance) {
			minTranslation = currMinTranslation;
			minTranslationDistance = Math.abs(currMinTranslation);
			mtv = pair.normal.mul(-minTranslation);
		}
	});
	return mtv;
}

export function detectAndResolveCollisionStaticDynamic(staticObj, dynamicObj) {
	if (colliding(staticObj, dynamicObj)) {
		const mtv = getMTV(staticObj, dynamicObj);
		dynamicObj.move(mtv);
	}
}
