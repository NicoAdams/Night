import { listenerCreator } from './listener_subscriber';

const keyDownListener = listenerCreator();
window.onkeydown = keyDownListener.getListener();
export function subscribeKeyDownListener(f) { return keyDownListener.subscribe(f); }
export function unsubscribeKeyDownListener(i) { return keyDownListener.unsubscribe(i); }

const keyUpListener = listenerCreator();
window.onkeyup = keyUpListener.getListener();
export function subscribeKeyUpListener(f) { return keyUpListener.subscribe(f); }
export function unsubscribeKeyUpListener(i) { return keyUpListener.unsubscribe(i); }
