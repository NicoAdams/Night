import {
	forEach
} from 'lodash';
import { makePolyObject } from '../object';
import { vec } from '../geom';
import { physicsSettings } from './physics_settings';
import { listenerCreator } from '../util/listener_subscriber';

export function makeDynamic(object) {
	object.collisionListener = listenerCreator();
	
	// Function to be run when a collision occurs. Should dispatch an {mtv, velocity} object
	const dispatchCollision = object.collisionListener.getListener();
	// f: Function that takes in an {mtv, velocity} object
	object.subscribeCollisionListener = function(f) { return object.collisionListener.subscribe(f); }
	object.unsubscribeCollisionListener = function(i) { return object.collisionListener.unsubscribe(i); }
	
	object.vel = vec(0,0);
	object.rvel = 0;
	object.accel = vec(0,0);
	object.raccel = 0;
	object.properties = {
		// Response to gravity
		buoyancy: 1,
		// Response to collision
		bounciness: 0
	};
	object.state = {
		collisions: []
	};
	
	object.update = function(dt) {
		// Dispatch collision events to listeners
		forEach(object.state.collisions, (coll) => dispatchCollision(coll));
		object.state.collisions = [];
		
		// Add gravity
		const gravityVec = vec(0, -physicsSettings.gravity)
			.mul(object.properties.buoyancy);
		object.accel = object.accel.add(gravityVec);
		
		// Update vel
		object.vel = object.vel.add(object.accel.mul(dt));
		object.rvel += object.raccel * dt;
		
		object.vel = object.vel.limit(physicsSettings.velLimit);
		
		// Update position
		object.move(object.vel.mul(dt));
		object.rotate(object.rvel * dt);
		
		// Reset accel on every update
		object.accel = vec(0,0);
		object.raccel = 0;
	};
	object.addVel = function(dvel) {
		object.vel = object.vel.add(dvel);
	};
	object.addRVel = function(drvel) {
		object.rvel += drvel
	}
	object.addAccel = function(daccel) {
		object.accel = object.accel.add(daccel);
	};
	object.addRAccel = function(draccel) {
		object.raccel += draccel;
	}
	object.registerCollision = function(coll) {
		object.state.collisions.push(coll);
	};
	
	// Unsubscribe this if you want something more interesting to happen
	object.standardCollisionListener = object.subscribeCollisionListener((coll) => {
		// Sets vel along collision direction to 0
		const mtv = coll.mtv;
		const parallelVel = object.vel.project(mtv);
		if (parallelVel.dot(mtv) < 0) {
			object.addVel(parallelVel.mul(-(1 + object.properties.bounciness)));
		}
	});
	
	return object;
}
