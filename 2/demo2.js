"use strict";

/**
 * Create a set of coordinates that we can work with
 * @returns {{}}
 * @constructor
 */
var Coordinates = {
    coordinates: [],
    length: 0,

    /**
     * Set coordinates
     * @param {Array} coords
     * @returns {Coordinates}
     */
    setCoordinates: function (coords) {
        // We need to use a little trick, because our array consist of literals:
        this.coordinates = JSON.parse(JSON.stringify(coords));
        this.length = this.coordinates.length;
        return this;
    },

    /**
     * Get the coordinates
     * @returns {Array}
     */
    getCoordinates: function() {
        return this.coordinates;
    }
};

/**
 * Simple randomizer
 * @returns {Coordinates}
 */
Coordinates.randomize = function() {
    for (var index = 0; index < this.length; index += 1) {
        this.coordinates[index].x += (Math.random() * 40) - 20;
        this.coordinates[index].y += (Math.random() * 40) - 20;
    }
    return this;
};

// Create coordinates with chaining:
var myCoordinates = Object.create(Coordinates);
var coordinates = myCoordinates
    .setCoordinates([{x:400, y:300}])
    .randomize()
    .getCoordinates();

// Draw a dot, for debugging purposes:
svgElement.drawDot(coordinates[0]);