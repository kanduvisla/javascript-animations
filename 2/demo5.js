"use strict";

/**
 * Create a set of coordinates that we can work with
 * @returns {{}}
 * @constructor
 */
var Coordinates = {
    coordinates: [],
    originalCoordinates: [],
    length: 0,

    /**
     * Set coordinates
     * @param {Array} coords
     * @returns {Coordinates}
     */
    setCoordinates: function (coords) {
        // We need to use a little trick, because our array consist of literals:
        this.coordinates = JSON.parse(JSON.stringify(coords));
        this.originalCoordinates = JSON.parse(JSON.stringify(coords));
        this.length = this.coordinates.length;
        return this;
    },

    /**
     * Get the coordinates
     * @returns {Array}
     */
    getCoordinates: function() {
        return this.coordinates;
    },

    /**
     * Reset the coordinates to their original coordinates
     * @returns {Coordinates}
     */
    reset: function() {
        this.coordinates = JSON.parse(JSON.stringify(this.originalCoordinates));
        return this;
    }
};

/**
 * Add a sinus translation
 * @returns {Coordinates}
 */
Coordinates.setSinus = function(sinRad, cosRad, amount) {
    for (var index = 0; index < this.length; index += 1) {
        this.coordinates[index].y += Math.sin(sinRad) * amount;
        this.coordinates[index].x += Math.cos(cosRad) * amount;
    }
    return this;
};

// Create coordinates with chaining:
var myCoordinates = Object.create(Coordinates);
var coordinates = myCoordinates
    .setCoordinates([{x:400, y:300}])
    .getCoordinates();

// Draw a dot, for debugging purposes:
var dot = svgElement.drawDot(coordinates[0]);

/**
 * Animation function
 * @param {float} elapsedMilliseconds
 */
function animate(elapsedMilliseconds) {
    // One PI per second:
    var pi = elapsedMilliseconds / (1000 / Math.PI);
    coordinates = myCoordinates
        .reset()
        .setSinus(pi, pi, 100)
        .getCoordinates();
    svgElement.updateDot(dot, coordinates[0]);
    window.requestAnimationFrame(animate);
}
animate(0);