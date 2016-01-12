"use strict";

/**
 * Create a set of coordinates that we can work with
 * @returns {{}}
 * @constructor
 */
var Coordinates = {
    coordinates: [],

    /**
     * Set coordinates
     * @param {Array} coords
     * @returns {Coordinates}
     */
    setCoordinates: function (coords) {
        this.coordinates = coords;
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
Coordinates.randomize = function()
{
    for (var index in this.coordinates) {
        if (this.coordinates.hasOwnProperty(index)) {
            this.coordinates[index].x += (Math.random() * 40) - 20;
            this.coordinates[index].y += (Math.random() * 40) - 20;
        }
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