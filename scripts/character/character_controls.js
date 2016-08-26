import {
	subscribeKeyDownListener,
	subscribeKeyUpListener
} from '../util/keybindings';
import { physics_settings } from '../physics/physics_settings';

export function assignCharacterControls(char) {
	subscribeKeyDownListener((e) => {
		if (e.key == 'ArrowUp') {
			char.queueAction(char.startJump, []);
		} else if (e.key == 'ArrowRight') {
			char.queueAction(char.startMoveSide, [1]);
		} else if (e.key == 'ArrowLeft') {
			char.queueAction(char.startMoveSide, [-1]);
		}
	});

	subscribeKeyUpListener((e) => {
		if (e.key == 'ArrowUp') {
			char.queueAction(char.endJump, []);
		} else if (e.key == 'ArrowRight') {
			char.queueAction(char.endMoveSide, [1]);
		} else if (e.key == 'ArrowLeft') {
			char.queueAction(char.endMoveSide, [-1]);	
		}
	});
};
