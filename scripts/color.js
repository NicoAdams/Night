export function makeColor(r,g,b) {
	color = {
		r: r,
		g: g,
		b: b,
		arr: function() {
			return [r,g,b];
		},
		toString: function() {
			return "rgb("+color.arr().toString()+")"
		}
	}
	return color;
}