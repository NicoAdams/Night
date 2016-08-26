import {
	head,
	last
} from 'lodash';

export function makeTimer(minDt=0, maxDt=Infinity) {
	var timer = {
		last: 0,
		prevTicks: [],
		prevTickLimit: 10,
		getTime: function() {
			return (new Date).getTime();
		},
		realTick: function() {
			var newTime = this.getTime();
			var dt = newTime - this.last;
			this.last = newTime;
			// Tracks FPS
			if (timer.prevTicks.length > timer.prevTickLimit) {
				timer.prevTicks.shift(); // Removes first element
			}
			timer.prevTicks.push(newTime);
			// Returns time delta
			return dt;
		},
		tick: function() {
			const realDt = timer.realTick();
			return Math.min(realDt, maxDt);
		},
		/**
		 * Starts the timer, calling tickFunction on each tick
		 */
		start: function(tickFunction) {
			this.last = this.getTime();
			setInterval(() => tickFunction(timer.tick()), minDt);
		},
		getAvgDt: function() {
			if (timer.prevTicks.length <= 1) {
				return 0;
			}
			return (last(timer.prevTicks) - head(timer.prevTicks)) / (timer.prevTicks.length - 1);
		}
	};
	return timer;
};
