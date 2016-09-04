import { forEach } from 'lodash';
import { makeTimer } from './timing';
import { viewport } from './viewport';
import { drawShape } from './drawing';
import { vec } from './geom';
import { makeRectObject } from './object';
import { physicsSettings } from './physics/physics_settings';
import { makeWorld } from './world';
import { makeCharacter } from './character/character';

const minDt = 0,
	  maxDt = 80;
const gameTimer = makeTimer(minDt, maxDt);
const animateTimer = makeTimer();

const startLoc = vec(0, 100),
	  dim = vec(10, 20);
const character = makeCharacter(startLoc, dim);

const groundShape = makeRectObject(vec(-100,0), vec(300, 15), 0, "GRAY");
const wallShape = makeRectObject(vec(-100,0), vec(20, 150), 0, "GRAY");

const world = makeWorld();
world.addStatic(groundShape);
world.addStatic(wallShape);
world.addCharacter(character);

/** 
 * Logic step
 */
function gameStep(dt) {
	world.update(dt);
	
	// TEST
	// const ground = 0;
	// let belowGround = 0;
	// forEach(character.object.points, (p) => {
	// 	belowGround = Math.min(belowGround, p.y-ground);
	// })
	// if (belowGround < 0) {
	// 	character.object.move(vec(0, -belowGround));
	// 	character.object.vel.y = -physicsSettings.gravity;
	// 	character.state.grounded = true;
	// } else {
	// 	character.state.grounded = false;
	// }
	
	// TEST
	// character.object.rotate(-0.1 * Math.PI * character.object.vel.x);
}

/**
 * Graphics step
 */
function animateFrame() {
	viewport.clear();
	world.draw();
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
