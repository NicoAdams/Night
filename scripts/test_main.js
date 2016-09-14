import { viewport } from './viewport';
import { vec } from './geom';
import {
	getOverlapObject,
	getIntersect,
	getAllIntersects,
	getAllPointsContained
} from './object_interactions';
import { makePolyObject } from './object';

viewport.init();

window.shape = makePolyObject([vec(-30,-30), vec(30,-30), vec(30,30), vec(-30, 30)]);
window.segment1 = [vec(0,0), vec(0,2)];
window.segment2 = [vec(1,1), vec(-1,1)];

window.vec = vec;
window.makePolyObject = makePolyObject;
window.getIntersect = getIntersect;
window.getOverlapObject = getOverlapObject;
window.getAllIntersects = getAllIntersects;
window.getAllPointsContained = getAllPointsContained;
