import {
	forEach,
	has,
	unset
} from "lodash";

export function listenerCreator() {
	const bindings = {};
	let index = 0;
	const lc = {
		subscribe: function(f) {
			const currIndex = index++;
			bindings[currIndex] = f;
			return currIndex;
		},
		unsubscribe: function(i) {
			if (has(bindings, i)) {
				unset(bindings, i);
				return true
			}
			return false;
		},
		getListener: function(printOut = null) {
			return (event) => {
				if (printOut) { console.log(printOut); }
				forEach(bindings, (f) => f(event));
			};
		}
	};
	return lc;
}