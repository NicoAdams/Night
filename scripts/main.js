import {
  subscribeKeyDownListener,
  unsubscribeKeyDownListener,
  subscribeKeyUpListener,
  unsubscribeKeyUpListener
} from "./util/keybindings";
import { viewport } from './viewport';
import { start } from './game';

// TEST
import { vec } from './geom';
import {
	getOverlapObject,
	getIntersect,
	getAllIntersects,
	getAllPointsContained
} from './object_interactions';
import { makePolyObject } from './object';

// Sets up the viewport
viewport.init();

// Starts the game
start();
window.printFPS = true;

window.shape = makePolyObject([vec(-100,-100), vec(100,-100), vec(100,100), vec(-100, 100)]);
window.vec = vec;
window.makePolyObject = makePolyObject;
window.getIntersect = getIntersect;
window.getOverlapObject = getOverlapObject;
window.getAllIntersects = getAllIntersects;
window.getAllPointsContained = getAllPointsContained;
