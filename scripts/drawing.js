import {
	map,
	forEach,
	head,
	tail
} from 'lodash';
import { viewport } from './viewport';

export function drawShape(shape, color="WHITE") {
	const c = viewport.getCanvasContext();
	c.beginPath();
	
	if (shape.length == 0) { return; }
	const screenShape = map(shape, viewport.toScreen);

	let pos = head(screenShape);
	c.moveTo(...pos);
	forEach(tail(screenShape), (pos) => {
		c.lineTo(...pos);
	});
	c.fillStyle = color;
	c.fill();
}