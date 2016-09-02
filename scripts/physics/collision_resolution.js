import {
	zip,
	forEach,
	map
} from 'lodash';

export function getProjectionPairs(o1, o2) {
	const normals = o1.getNormals.concat(o2.getNormals)
	const projections1 = map(normals, (n) => {
		o1.projectOnto(n);
	});
	const projections2 = map(normals, (n) => {
		o2.projectOnto(n);
	});
	return zip(projections1, projections2);
}

export function colliding(o1, o2) {
	forEach(getProjectionPairs(o1, o2), (pair) => {
		if (!pair[0].instersects(pair[1])) {
			return false;
		}
	});
	return true;
}

/**
 * Returns the MTV for o2 to translate off of o1
 */
export function getMTV(o1, o2) {
	minDistance = 0;
	forEach(getProjectionPairs(o1, o2), (pair) => {
		
	});
}

export function resolveStaticDynamic(staticObj, dynamicObj) {
	const mtv = getMTV(dynamicObj, dynamicObj);
	dynamicObj.move(mtv);
}