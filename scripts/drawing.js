import {
	map,
	forEach,
	head,
	tail
} from 'lodash';
import { viewport } from './viewport';

function getScreenShape(shape) {
	return map(shape, (v) => viewport.toScreen(v).arr());
}

export function fillShape(shape, color) {
	if (!color) {return;}
	
	const c = viewport.getCanvasContext();
	c.beginPath();
	
	if (shape.length == 0) { return; }
	const screenShape = getScreenShape(shape);

	let pos = head(screenShape);
	c.moveTo(...pos);
	forEach(tail(screenShape), (pos) => {
		c.lineTo(...pos);
	});
	c.fillStyle = color;
	c.fill();
}

export function outlineShape(shape, color, lineWidth=2) {
	if (!color) {return;}
	
	const c = viewport.getCanvasContext();
	c.beginPath();
	
	if (shape.length == 0) { return; }
	const screenShape = getScreenShape(shape);

	let pos = head(screenShape);
	c.moveTo(...pos);
	forEach(tail(screenShape), (pos) => {
		c.lineTo(...pos);
	});
	c.lineTo(...pos)
	c.strokeStyle = color;
	c.lineWidth = lineWidth;
	c.stroke();
}