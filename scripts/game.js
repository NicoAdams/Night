import { forEach } from 'lodash';
import { makeTimer } from './timing';
import { viewport } from './viewport';
import { drawShape } from './drawing';
import { vec } from './geom';
import {
	makeRectObject,
	makeRegularPolyObject
} from './object';
import { makeDynamic } from './physics/dynamic_object';
import { physicsSettings } from './physics/physics_settings';
import { makeWorld } from './world';
import { makeCharacter } from './character/character';

// -- Setup --

const minDt = 0,
	  maxDt = 40;
const gameTimer = makeTimer(minDt, maxDt);
const animateTimer = makeTimer();

const startLoc = vec(0, 100),
	  dim = vec(10, 20);
const character = makeCharacter(startLoc, dim);

const world = makeWorld();
world.addCharacter(character);

// Make the walls!
const roomDim = vec(1000, 800);
const wallWidth = 1000;
world.addStatic(makeRectObject(
	vec(-(roomDim.x + 2*wallWidth)/2, 0),
	vec(roomDim.x + 2*wallWidth, -wallWidth),
	0,
	"GRAY"));
world.addStatic(makeRectObject(
	vec(-roomDim.x/2, -wallWidth),
	vec(-wallWidth, roomDim.y + 2*wallWidth),
	0,
	"GRAY"));
world.addStatic(makeRectObject(
	vec(roomDim.x/2, -wallWidth),
	vec(wallWidth, roomDim.y + 2*wallWidth),
	0,
	"GRAY"));
world.addStatic(makeRectObject(
	vec(-(roomDim.x + 2*wallWidth)/2, roomDim.y),
	vec(roomDim.x + 2*wallWidth, wallWidth),
	0,
	"GRAY"));

for(let j=1; j<8; j++) {
	const offSet = 50*Math.random();
	for(let i=1; i<10; i++) {
		world.addStatic(makeRegularPolyObject(
			3 + Math.round(3 * Math.random()),
			vec(i*100 - 500 - 25 + offSet, 100 * j),
			15,
			Math.random() * Math.PI * 2,
			"YELLOW"));
	}
}

// const bouncingObj = makeDynamic(makeRectObject(vec(2,750), vec(20,20), Math.PI/4, "GREEN"));
// bouncingObj.properties.bounciness = 0.99;
// bouncingObj.vel = vec(-0.1,0)
// world.addDynamic(bouncingObj);

const bouncingObj2 = makeDynamic(makeRegularPolyObject(20, vec(2,750), 10, Math.PI/4, "RED"));
bouncingObj2.properties.bounciness = 1.01;
bouncingObj2.vel = vec(0.1,0)
world.addDynamic(bouncingObj2);


// TEST
window.character = character;

// -- Run --

function gameStep(dt) {
	world.update(dt);
}
function animateFrame() {
	viewport.setCenter(vec(character.object.com().x, 300));
	viewport.setZoom(0.65)
	
	viewport.clear();
	world.draw();
}
export function start() {
	gameTimer.start(gameStep);
	animateTimer.start(animateFrame);
}

// window.printTPS = true;
window.printFPS = true;

// TPS and FPS printing
setInterval(() => {
	if (window.printTPS) {
		console.info("TPS: " + Math.floor(1000 / gameTimer.getAvgDt()) + " (avg "+Math.round(gameTimer.getAvgDt())+"ms)")
	}
	if (window.printFPS) {
		console.info("FPS: " + Math.floor(1000 / animateTimer.getAvgDt()) + " (avg "+Math.round(animateTimer.getAvgDt())+"ms)")
	}
}, 1000);
