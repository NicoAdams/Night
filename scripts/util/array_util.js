import {
	reduce
} from 'lodash';

export function forEachPair(arr, f) {
	for (let i1 = 0; i1 < arr.length; i1++) {
		const i2 = (i1 + 1) % arr.length;
		const e1 = arr[i1],
			  e2 = arr[i2];
		f(e1, e2);
	}
}

export function sum(arr) {
	if (arr.length == 0) { return 0; }
	return reduce(arr, (a,b) => {return a+b;})
}