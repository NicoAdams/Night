import {
	map,
	forEach,
	head,
	tail
} from 'lodash';
import { viewport } from './viewport';

export function drawShape(shape, color="WHITE") {
	
	if (shape.length == 0) { return; }
	
	const screenShape = map(shape, viewport.toScreen);
	
	const c = viewport.getCanvasContext();
	c.beginPath();
	
	// TODO use spread syntax
	let sp = head(screenShape);
	c.moveTo(sp[0], sp[1]);
	forEach(tail(screenShape), (sp) => {
		c.lineTo(sp[0], sp[1]);
	});
	c.fillStyle = color;
	c.fill();
}