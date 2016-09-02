import { makeRectObject } from '../object';
import { makeDynamic } from '../physics/dynamic_object';
import { physicsSettings } from '../physics/physics_settings';
import { vec } from '../geom';
import { assignCharacterControls } from './character_controls';

export function makeCharacter(startLoc, dim) {
	const char = {
		object: makeDynamic(makeRectObject(startLoc, dim)),
		properties: {
			sideAccel: 2.5 * physicsSettings.baseSpeed,
			groundedSideDecel: 2.5 * physicsSettings.baseSpeed,
			aerialSideDecel: 0,
			jumpSpeed: 1700 * physicsSettings.baseSpeed,
			jumpingAccelGoingUp: 0.5 * physicsSettings.gravity,
			jumpingAccelGoingDown: 0
		},
		state: {
			grounded: false,
			justJumped: false,
			isJumping: false,
			movingSide: {'1': false, '-1': false},
			currMovingSide: 0
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
		update: function(dt) {
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
				const currSideAccel = char.state.currMovingSide * char.properties.sideAccel;
				char.object.addAccel(vec(currSideAccel, 0));
			} else {
				const currSideMotion = Math.sign(char.object.vel.x);
				const currSideDecel = (
					char.state.grounded
					? char.properties.groundedSideDecel
					: char.properties.aerialSideDecel
				);
				char.object.addAccel(vec(-currSideMotion * currSideDecel, 0));
			}
		}
	};
	assignCharacterControls(char);
	return char;
}
