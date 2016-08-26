import { vec } from '../geom';

const physicsSettings = {};
physicsSettings.baseSpeed = 0.5;
physicsSettings.gravity = 6 * Math.pow(10, -4);
physicsSettings.velLimit = vec(
	1,
	1
);

export { physicsSettings };

window.setPhysicsSpeed = function(speed) {
	physicsSettings.baseSpeed = speed;
}
