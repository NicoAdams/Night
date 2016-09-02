import { character } from './character';
import {
	subscribeKeyDownListener,
	subscribeKeyUpListener
} from '../util/keybindings';
import { physics_settings } from '../physics/physics_settings';

export function assignCharacterControls(char) {
	subscribeKeyDownListener((e) => {
		if (e.key == 'ArrowUp') {
			character.startJump();
		} else if (e.key == 'ArrowRight') {
			character.startMoveSide(1);
		} else if (e.key == 'ArrowLeft') {
			character.startMoveSide(-1);
		}
	});

	subscribeKeyUpListener((e) => {
		if (e.key == 'ArrowUp') {
			character.endJump();
		} else if (e.key == 'ArrowRight') {
			character.endMoveSide(1);		
		} else if (e.key == 'ArrowLeft') {
			character.endMoveSide(-1);		
		}
	});
};
