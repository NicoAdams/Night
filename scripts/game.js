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
// world.addStatic(makeRectObject(
// 	vec(-(roomDim.x + 2*wallWidth)/2, roomDim.y),
// 	vec(roomDim.x + 2*wallWidth, wallWidth),
// 	0,
// 	"GRAY"));

// Obstacles
function obstacleColor(input) {
	if (input == 0) return "rgb(250,200,150)";
	if (input == 1) return "rgb(150,250,200)";
	if (input == 2) return "rgb(200,150,250)";
	if (input == 3) return "rgb(200,250,150)";
}
for(let j=1; j<8; j++) {
	const offSet = 50*Math.random();
	for(let i=1; i<10; i++) {
		const sides = 3 + Math.round(3 * Math.random());
		const input = (i + j) % 4;
		world.addStatic(makeRegularPolyObject(
			sides,
			vec(i*100 - 500 - 25 + offSet, 100 * j),
			15,
			Math.random() * Math.PI * 2,
			obstacleColor(input)));
	}
}

const bouncingObj = makeDynamic(makeRectObject(vec(2,750), vec(20,20), Math.PI/4, "RED"));
bouncingObj.properties.bounciness = 0.9;
bouncingObj.properties.friction = 0.05;
bouncingObj.vel = vec(-0.1,.5);
world.addDynamic(bouncingObj);

for(let i=0; i<8; i++) {
	const bouncingObj2 = makeDynamic(makeRegularPolyObject(8, vec(-100 + 100*i ,750), 10, 0, "CHARTREUSE"));
	bouncingObj2.properties.bounciness = 0.7;
	bouncingObj2.properties.friction = 0.1;
	bouncingObj2.vel = vec(Math.random() - 0.5,.5);
	world.addDynamic(bouncingObj2);
}

// TEST
window.character = character;

// -- Run --

function gameStep(dt) {
	world.update(dt);
}
function animateFrame() {
	viewport.setCenter(vec(character.object.com().x, roomDim.y/2 - 50));
	viewport.setZoom(0.75);
	
	viewport.clear();
	world.draw();
}
export function start() {
	gameTimer.start(gameStep);
	animateTimer.start(animateFrame);
}

window.printSPS = true;
// window.printFPS = true;

// TPS and FPS printing
setInterval(() => {
	if (window.printSPS) {
		const avgDt = Math.round(gameTimer.getAvgDt());
		const msg = "SPS: " + Math.floor(1000 / avgDt) + " (avg "+Math.round(avgDt)+"ms)"
		const colorStr = "color:"+(avgDt < maxDt ? "BLACK" : "RED");
		console.info("%c"+msg, colorStr);
	}
	if (window.printFPS) {
		console.info("FPS: " + Math.floor(1000 / animateTimer.getAvgDt()) + " (avg "+Math.round(animateTimer.getAvgDt())+"ms)")
	}
}, 1000);
