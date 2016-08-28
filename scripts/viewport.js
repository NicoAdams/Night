// Creates global canvas and context
const canvas = document.getElementById("canvas")
const c = canvas.getContext("2d")

// Contains viewport info and methods
const viewport = {
	centerX: 0,
	centerY: 0,
	zoom: 1, // Pixels / in-game units
	init: function() {
		// Sets up the canvas
		viewport.resizeCanvas();

		// Handles browser resize
		window.onresize = function() {
			viewport.resizeCanvas();
		}
	},
	getCanvasContext: function() {
		return c;
	},
	clear: function() {
		// Clears the screen
		canvas.width = canvas.width;
	},
	screenWidth: function() {
		// Returns the screen width
		return window.innerWidth
	},
	screenHeight: function() {
		// Returns the screen height
		return window.innerHeight
	},
	left: function() {
		// Returns the game coord of the left screen edge
		return viewport.centerX - (viewport.screenWidth() / 2) / viewport.zoom
	},
	right: function() {
		// Returns the game coord of the right screen edge
		return viewport.centerX + (viewport.screenWidth() / 2) / viewport.zoom
	},
	bottom: function() {
		// Returns the game coord of the bottom screen edge
		return -viewport.centerY - (viewport.screenHeight() / 2) / viewport.zoom
	},
	top: function() {
		// Returns the game coord of the top screen edge
		return -viewport.centerY + (viewport.screenHeight() / 2) / viewport.zoom
	},
	toScreen: function(gameCoord) { 
		// Converts game coords to pixels
		var x = gameCoord[0]
		var y = gameCoord[1]
		var xval = (x - viewport.left()) * viewport.zoom
		var yval = (-y - viewport.bottom()) * viewport.zoom
		return [xval, yval]
	},
	toGame: function(screenCoord) {
		// Converts pixels to game coords
		var x = screenCoord[0]
		var y = screenCoord[1]
		var xval = x / viewport.zoom + viewport.left()
		var yval = - (y / viewport.zoom + viewport.bottom())
		return [xval, yval]
	},
	resizeCanvas: function() {
		// Initializes the canvas
		canvas.width = viewport.screenWidth();
		canvas.height = viewport.screenHeight();
	},
	setCenter: function(gameCoords) {
		viewport.centerX = gameCoords[0];
		viewport.centerY = gameCoords[1];
	},
	setZoom: function(zoom) {
		viewport.zoom = zoom;
	}
};

export { c, viewport };
