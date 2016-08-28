import {
	forEach,
	has,
	unset
} from "lodash";

var keyDownBindings = {},
	keyUpBindings = {},
	keyDownBindingIndex = 0,
	keyUpBindingIndex = 0;

window.onkeydown = function(e) {
	forEach(keyDownBindings, (f) => f(e));
}

window.onkeyup = function(e) {
	forEach(keyUpBindings, (f) => f(e));
}

export function subscribeKeyDownListener(func) {
	var currIndex = keyDownBindingIndex;
	keyDownBindings[currIndex] = func;
	keyDownBindingIndex += 1;
	return currIndex;
}

export function subscribeKeyUpListener(func) {
	var currIndex = keyUpBindingIndex;
	keyUpBindings[currIndex] = func;
	keyUpBindingIndex += 1;
	return currIndex;
}

export function unsubscribeKeyDownListener(index) {
	if (has(keyDownBindings, index)) {
		unset(keyDownBindings, index);
		return true
	}
	return false;
}

export function unsubscribeKeyUpListener(index) {
	if (has(keyUpBindings, index)) {
		unset(keyUpBindings, index);
		return true
	}
	return false;
}