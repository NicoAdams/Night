console.log("main!")

import _ from 'lodash';
import {
  subscribeKeyDownListener,
  unsubscribeKeyDownListener,
  subscribeKeyUpListener,
  unsubscribeKeyUpListener
} from "./util/keybindings";
import { initialize } from './initialize';
import { viewport } from './util/viewport';
import { start } from './game';

// Initializes the app
initialize();

var index = subscribeKeyDownListener(
  (e) => {
    if (e.key == "ArrowUp") {
      console.log("Up arrow down!")
    }
  }
);

console.log("main:", index);

subscribeKeyUpListener(
  (e) => {
    if (e.key == "ArrowUp") {
      console.log("Up arrow up!", index);
      unsubscribeKeyDownListener(index);
    }
  }
);

// Sets up the viewport
viewport.init();

// Starts the game
start();