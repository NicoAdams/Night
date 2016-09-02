import { vec } from '../geom';

const physicsSettings = {};
physicsSettings.baseSpeed = 1.5 * Math.pow(10, -4);
physicsSettings.gravity = 4 * physicsSettings.baseSpeed;
physicsSettings.velLimit = vec(
	2 * Math.pow(10,3) * physicsSettings.baseSpeed,
	2 * Math.pow(10,3) * physicsSettings.baseSpeed
);

export { physicsSettings };