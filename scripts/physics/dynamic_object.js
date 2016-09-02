import { makePolyObject } from '../object';
import { vec } from '../geom';
import { physicsSettings } from './physics_settings';

export function makeDynamic(object) {
	object.vel = vec(0,0);
	object.accel = vec(0,0);
	object.properties = {
		// Response to gravity
		buoyancy: 1
	}
	object.update = function(dt) {
		// Special case: Add gravity
		const gravityVec = vec(0, -physicsSettings.gravity)
			.mul(object.properties.buoyancy);
		object.accel = object.accel.add(gravityVec);
		// Update pos, vel
		object.move(object.vel.mul(dt));
		object.vel = object.vel.add(object.accel.mul(dt));
		// Limit the vel to a bounding box
		object.vel = object.vel.limit(physicsSettings.velLimit);
		// Reset accel on every update
		object.accel = vec(0,0);
	};
	object.addVel = function(dVel) {
		object.vel = object.vel.add(dVel);
	};
	object.addAccel = function(dAccel) {
		object.accel = object.accel.add(dAccel);
	};
	return object;
}