// import _ from 'lodash';
import {
  subscribeKeyDownListener,
  unsubscribeKeyDownListener,
  subscribeKeyUpListener,
  unsubscribeKeyUpListener
} from "./util/keybindings";
import { viewport } from './viewport';
import { start } from './game';

// TEST
import { makePolyObject } from './object';
import { vec } from './geom';
import { character } from './character/character';
import './character/character_controls';

// Sets up the viewport
viewport.init();

// Starts the game
start();
