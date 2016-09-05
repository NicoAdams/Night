import {
	forEach
} from 'lodash';
import { makeRectObject } from '../object';
import { makeDynamic } from '../physics/dynamic_object';
import { physicsSettings } from '../physics/physics_settings';
import { vec } from '../geom';
import { assignCharacterControls } from './character_controls';
import { makeCharacterAction } from './character_action';

export function makeCharacter(startLoc, dim) {
	const char = {
		object: makeDynamic(makeRectObject(startLoc, dim)),
		properties: {
			sideAccel: 7 * Math.pow(10, -4),
			groundedSideDecel: 9 * Math.pow(10, -4),
			aerialSideDecel: .5 * Math.pow(10, -4),
			maxSideSpeed: .3,
			jumpSpeed: .3,
			jumpingAccelGoingUp: 0.6 * physicsSettings.gravity,
			jumpingAccelGoingDown: 0,
			groundedAngle: Math.PI / 4
		},
		state: {
			actions: [],
			grounded: false,
			justJumped: false,
			isJumping: false,
			movingSide: {'1': false, '-1': false},
			currMovingSide: 0,
		},
		queueAction: function(action, args) {
			char.state.actions.push(makeCharacterAction(action, args));
		},
		startJump: function() {
			if (char.state.grounded) {
				char.state.justJumped = true;
				char.state.isJumping = true;
			}
		},
		endJump: function() {
			if (char.state.isJumping) {
				char.state.isJumping = false;
			}
		},
		startMoveSide: function(side) {
			char.state.movingSide[String(side)] = true;
			char.state.currMovingSide = side;
		},
		endMoveSide: function(side) {
			char.state.movingSide[String(side)] = false;
			// If the other side arrow is still held, start moving that way
			if (char.state.movingSide[String(-side)]) {
				char.startMoveSide(-side);
			} else {
				char.state.currMovingSide = 0;
			}
		},
		evaluateActions: function() {
			forEach(char.state.actions, (charAction) => {
				charAction.action(...charAction.args);
			})
			char.state.actions = [];
		},
		update: function(dt) {
			// After object.update
						
			char.evaluateActions();
			
			// Jump action
			if (char.state.justJumped) {
				char.state.justJumped = false;
				const jumpVel = vec(0, 1).mul(char.properties.jumpSpeed);
				char.object.addVel(jumpVel);
			}
			// Mid-jump acceleration
			if (char.state.isJumping) {
				const currJumpingAccel = (
					char.object.vel.y > 0
					? char.properties.jumpingAccelGoingUp
					: char.properties.jumpingAccelGoingDown
				);
				char.object.addAccel(vec(0, currJumpingAccel));
			}
			// Side to side motion
			if (char.state.currMovingSide) {
				// Only accelerate if the current side speed is within limits
				const currSideAccel = (
					char.state.currMovingSide * char.object.vel.x < char.properties.maxSideSpeed
					? char.state.currMovingSide * char.properties.sideAccel
					: 0
					);
				char.object.addAccel(vec(currSideAccel, 0));
			} else {
				// TODO To change ground direction dynamically, this bit needs a LOT of work
				const currSideVel = char.object.vel.x;
				const currSideMotion = Math.sign(currSideVel);
				let currSideDecel = (
					char.state.grounded
					? char.properties.groundedSideDecel
					: char.properties.aerialSideDecel
				);
				if (Math.abs(currSideDecel * dt) > Math.abs(currSideVel)) {
					// Set character side vel to zero
					char.object.vel = char.object.vel.project(vec(0,1));
				} else {
					// Decelerate the character
					char.object.addAccel(vec(-currSideMotion * currSideDecel, 0));
				}
			}
			
			char.state.grounded = false;
		},
	};
	
	// Sets up key listening and control scheme
	assignCharacterControls(char);
	
	// Sets up interactions with other objects
	char.object.subscribeCollisionListener((coll) => {
		const mtv = coll.mtv;
		const angle = mtv.angle(),
			  minAngle = Math.PI/2 - char.properties.groundedAngle,
			  maxAngle = Math.PI/2 + char.properties.groundedAngle;
		if (angle > minAngle && angle < maxAngle) {
			char.state.grounded = true;
		}
	});
	
	return char;
}
