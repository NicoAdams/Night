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
		objects: {}, 			// Everything
		staticObjects: {}, 		// Collidable objects that don't move
		dynamicObjects: {}, 	// Collidable object that move
		drawableObjects: {}, 	// Things with .draw()
		updatableObjects: {}, 	// Things with .update()
		lightingObjects: {}, 	// Color-changing objects
		characters: {},
		drawNextStep: [],
		addStatic: function(object, collidable=true) {
			const objectKey = getAndUpdateObjectId();
			world.objects[objectKey] = object;
			world.drawableObjects[objectKey] = object;
			if (collidable) { world.staticObjects[objectKey] = object; }
			return objectKey;
		},
		addDynamic: function(object, collidable=true) {
			const objectKey = getAndUpdateObjectId();
			world.objects[objectKey] = object;
			world.drawableObjects[objectKey] = object;
			world.updatableObjects[objectKey] = object;
			if (collidable) { world.dynamicObjects[objectKey] = object; }
			return objectKey;
		},
		addLighting: function(object, updatable=false, drawable=false) {
			const objectKey = getAndUpdateObjectId();
			world.objects[objectKey] = object;
			world.lightingObjects[objectKey] = object;
			if (updatable) { world.updatableObjects[objectKey] = object; }
			if (drawable) { world.drawableObjects[objectKey] = object; }
			return objectKey;
		},
		addCharacter: function(char) {
			const objectKey = world.addDynamic(char.object);
			world.objects[objectKey] = char.object;
			world.characters[objectKey] = char;
			return objectKey;
		},
		removeObject: function(objectKey) {
			if (has(world.objects, objectKey)) {
				unset(world.objects, objectKey);
				// Unset fails silently when a key DNE
				unset(world.drawableObjects, objectKey);
				unset(world.staticObjects, objectKey);
				unset(world.dynamicObjects, objectKey);
				unset(world.updatableObjects, objectKey);
				unset(world.lightingObjects, objectKey);
				unset(world.characters, objectKey);
				return true;
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
			forEach(keys(world.drawableObjects), (objKey) => {
				forEach(keys(world.lightingObjects), (lightingObjKey) => {
					if (objKey == lightingObjKey) { return false; }
					const obj = world.drawableObjects[objKey],
						  lightingObj = world.lightingObjects[lightingObjKey];					
					const overlapObj = getOverlapObject(obj, lightingObj);
					if (overlapObj) {
						const colorVals = lightingObj.getColor(obj);
						world.drawNextStep.push(
							overlapObj.withFillColor(colorVals.fillColor).withDrawColor(colorVals.drawColor)
						);
					}
				})
			})
		},
		draw: function () {
			forEach(world.drawableObjects, (o) => {
				o.draw();
			});
			forEach(world.drawNextStep, (o) => {
				o.draw();
			});
			world.drawNextStep = [];
		}
	};
	
	// TEST
	window.onmousedown = function(e) {
		const clickCoord = viewport.toGame(e);
		forEach(world.drawableObjects, (o) => {
			if(o.containsPoint(clickCoord)) {
				o.fillColor = "RED";
				o.drawColor = null;
			}
		});
	}
	
	return world;
}
