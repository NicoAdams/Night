import { forEach } from 'lodash';
import { makeTimer } from './timing';
import { viewport } from './viewport';
import { drawShape } from './drawing';
import { vec } from './geom';
import {
	makeRectObject,
	makeRegularPolyObject,
	addLightingFunction
} from './object';
import { makeDynamic } from './physics/dynamic_object';
import { physicsSettings } from './physics/physics_settings';
import { makeWorld } from './world';
import { makeCharacter } from './character/character';

// -- Setup --

const minDt = 0,
	  maxDt = 50;
const gameTimer = makeTimer(minDt, maxDt);

const startLoc = vec(0, 100),
	  dim = vec(10, 20);
const character = makeCharacter(startLoc, dim);

const world = makeWorld();
world.addCharacter(character);

// Make the walls
const roomDim = vec(800, 700);
const wallWidth = 100;
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

// Obstacles
function obstacleColor(input) {
	if (input == 0) return "rgb(250,200,150)";
	if (input == 1) return "rgb(150,250,200)";
	if (input == 2) return "rgb(200,150,250)";
	if (input == 3) return "rgb(200,250,150)";
}
for(let j=1; j<roomDim.y/100; j++) {
	const offSet = 50*Math.random();
	for(let i=1; i<roomDim.x/100; i++) {
		const sides = 3 + Math.round(3 * Math.random());
		// const input = (i + j) % 4;
		world.addStatic(makeRegularPolyObject(
			sides,
			vec(i*100 - roomDim.x/2 - 25 + offSet, 100 * j),
			20,
			Math.random() * Math.PI * 2)
			.withDrawColor(obstacleColor(sides-3)));
	}
}

const bouncingObj = makeDynamic(makeRectObject(vec(2,roomDim.y-50), vec(20,20), Math.PI/4)).withDrawColor("RED");
bouncingObj.properties.bounciness = 1;
bouncingObj.properties.friction = 0;
bouncingObj.vel = vec(-0.1,.5);
bouncingObj.rvel = .005;
world.addDynamic(bouncingObj);

const objectIndices = [];
const maxLen = 20;
let intervalCount = 0;
setInterval(() => {
	const bouncingObj2 = makeDynamic(makeRegularPolyObject(
			5,
			vec(Math.random() * 300 - 150, roomDim.y-50),
			intervalCount%2==0 ? 25 : 15,
			0))
		.withFillColor(null)
		.withDrawColor(intervalCount%2==0 ? "DARKBLUE" : null);
		
	bouncingObj2.properties.bounciness = 0.85;
	bouncingObj2.properties.friction = 0.2;
	bouncingObj2.vel = vec(Math.random() - 0.5,-0.1);
	bouncingObj2.rvel = 0.01 * Math.random() - 0.005;
	objectIndices.push(world.addDynamic(bouncingObj2));
	
	if (objectIndices.length > maxLen) {
		world.removeObject(objectIndices.shift());
	}
	intervalCount ++;
}, 400)

// Add lighting object

const lightingObj = makeRegularPolyObject(
	10,
	vec(0, roomDim.y/2),
	200,
	0
)

world.addDecorative(lightingObj.withDrawColor("WHITE"));

world.addLighting(
	addLightingFunction(
		lightingObj,
		function(obj) {
			if (obj.drawColor == null) {
				return {
					fillColor: "WHITE"
				}				
			}
			return {}
		}
	)
);

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
function step(dt) {
	gameStep(dt);
	animateFrame();
}

export function start() {
	gameTimer.start(step);
}

// FPS printing
setInterval(() => {
	if (window.printFPS) {
		const avgDt = Math.round(gameTimer.getAvgDt());
		const msg = "FPS: " + Math.floor(1000 / avgDt) + " (avg "+Math.round(avgDt)+"ms)"
		const colorStr = "color:"+(avgDt < maxDt ? "BLACK" : "RED");
		console.info("%c"+msg, colorStr);
	}
}, 1000);
