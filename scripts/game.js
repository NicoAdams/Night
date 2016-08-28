import { forEach } from 'lodash';
import { makeTimer } from './timing';
import { viewport } from './viewport';
import { drawShape } from './drawing';
import { vec } from './geom';
import { makeRectObject } from './object';
import { physicsSettings } from './physics/physics_settings';

// TEST
import { character } from './character/character';

// Creates the timers
const minDt = 0,
	  maxDt = 80;
const gameTimer = makeTimer(minDt, maxDt);
const animateTimer = makeTimer();

// TEST
let shape1 = makeRectObject(vec(-10,-10), vec(20, 20));
let shape2 = makeRectObject(vec(20,-10), vec(20,20));
shape1.rotate(Math.PI/4);
character.object.accel = vec(0,-1).mul(physicsSettings.gravity);

/** 
 * Logic step
 */
function gameStep(dt) {
	character.update(dt);
	
	// TEST
	const ground = 0;
	let belowGround = 0;
	forEach(character.object.points, (p) => {
		belowGround = Math.min(belowGround, p.y-ground);
	})
	if (belowGround < 0) {
		character.object.move(vec(0, -belowGround));
		character.object.vel.y = -physicsSettings.gravity;
		character.state.grounded = true;
	} else {
		character.state.grounded = false;
	}
	
	// TEST
	character.object.rotate(-0.1 * Math.PI * character.object.vel.x);
}

/**
 * Graphics step
 */
function animateFrame() {
	viewport.clear();
	
	// TEST
	drawShape(character.object.points);
	// viewport.setZoom(4/(Math.sin(gameTimer.getTime()/400) + 2));
}

export function start() {
	// Logic loop
	gameTimer.start(gameStep);
	
	// Animation loop
	animateTimer.start(animateFrame);
}

// TPS and FPS printing
setInterval(() => {
	if (window.printTPS) {
		console.info("TPS: ", Math.floor(1000 / gameTimer.getAvgDt()))
	}
	if (window.printFPS) {
		console.info("FPS: ", Math.floor(1000 / animateTimer.getAvgDt()))
	}
}, 1000);