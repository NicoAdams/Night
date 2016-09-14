import {
	forEach,
	keys,
	values,
	has,
	unset
} from 'lodash';
import { detectAndResolveCollisionStaticDynamic } from './physics/collision_resolution';
import { physicsSettings } from './physics/physics_settings';
import { getOverlapObject } from './object_interactions';
// TEST
import { viewport } from './viewport';

let objectId = 0;
function getAndUpdateObjectId() {
	const currObjectId = objectId;
	objectId++;
	return currObjectId;
}

export function makeWorld() {
	const world = {
		objects: {},
		staticObjects: {},
		dynamicObjects: {},
		characters: {},
		drawNextStep: [],
		addDecorative: function(object) {
			const objectKey = getAndUpdateObjectId();
			world.objects[objectKey] = object;
			return objectKey;
		},
		addStatic: function(object) {
			const objectKey = getAndUpdateObjectId();
			world.objects[objectKey] = object;
			world.staticObjects[objectKey] = object;
			return objectKey;
		},
		addDynamic: function(object) {
			const objectKey = getAndUpdateObjectId();
			world.objects[objectKey] = object;
			world.dynamicObjects[objectKey] = object;
			return objectKey;
		},
		addCharacter: function(char) {
			const objectKey = world.addDynamic(char.object);
			world.characters[objectKey] = char;
			return objectKey;
		},
		removeObject: function(objectKey) {
			if (has(world.objects, objectKey)) {
				unset(world.objects, objectKey);
				// Can do these without checking because unset fails silently when a key DNE
				unset(world.staticObjects, objectKey);
				unset(world.dynamicObjects, objectKey);
				unset(world.characters, objectKey);
				return true
			}
			return false;
		},
		update: function(dt) {
			const effDt = dt * physicsSettings.baseSpeed;
			
			// Update objects
			forEach(values(world.dynamicObjects), (o) => o.update(effDt));
			forEach(values(world.characters), (c) => c.update(effDt));
			
			// Resolve collisions
			forEach(values(world.staticObjects), (staticObject) => {
				forEach(values(world.dynamicObjects), (dynamicObject) => {
					detectAndResolveCollisionStaticDynamic(staticObject, dynamicObject);
				});
			});
			
			// Add cool overlap shapes to the drawing queue
			forEach(keys(world.dynamicObjects), (obj1Key) => {
				forEach(keys(world.dynamicObjects), (obj2Key) => {
					if (obj1Key == obj2Key) {return false;}
					const obj1 = world.dynamicObjects[obj1Key],
						  obj2 = world.dynamicObjects[obj2Key];
					const overlapObj = getOverlapObject(obj1, obj2);
					if (overlapObj) { world.drawNextStep.push(overlapObj); }
				})
			})
		},
		draw: function () {
			forEach(world.objects, (o) => {
				o.draw();
			});
			
			forEach(world.drawNextStep, (o) => {
				o.withDrawColor("WHITE").withFillColor(null).draw();
			})
			world.drawNextStep = [];
		}
	};
	
	// TEST
	window.onmousedown = function(e) {
		// Can actually just use e as a vector!
		const clickCoord = viewport.toGame(e);
		forEach(world.objects, (o) => {
			if(o.containsPoint(clickCoord)) {
				o.fillColor = "RED";
				o.drawColor = null;
			}
		});
	}
	
	return world;
}