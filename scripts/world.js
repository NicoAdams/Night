import {
	forEach,
	values,
	has,
	unset
} from 'lodash';
import { detectAndResolveCollisionStaticDynamic } from './physics/collision_resolution';

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
			// Update objects
			forEach(values(world.dynamicObjects), (o) => o.update(dt));
			forEach(values(world.characters), (c) => c.update(dt));
			
			// Resolve collisions
			forEach(values(world.staticObjects), (staticObject) => {
				forEach(world.dynamicObjects, (dynamicObject) => {
					detectAndResolveCollisionStaticDynamic(staticObject, dynamicObject);
				});
			});
		},
		draw: function () {
			forEach(world.objects, (o) => {
				o.draw();
			});
		}
		
	};
	return world;
} 