import {
	subscribeKeyDownListener,
	subscribeKeyUpListener
} from '../util/keybindings';
import { physics_settings } from '../physics/physics_settings';

export function assignCharacterControls(char) {
	subscribeKeyDownListener((e) => {
		if (e.key == 'ArrowUp') {
			char.startJump();
		} else if (e.key == 'ArrowRight') {
			char.startMoveSide(1);
		} else if (e.key == 'ArrowLeft') {
			char.startMoveSide(-1);
		}
	});

	subscribeKeyUpListener((e) => {
		if (e.key == 'ArrowUp') {
			char.endJump();
		} else if (e.key == 'ArrowRight') {
			char.endMoveSide(1);		
		} else if (e.key == 'ArrowLeft') {
			char.endMoveSide(-1);		
		}
	});
};
