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
    }
};

/**
 * Add a sinus translation
 * @returns {Coordinates}
 */
Coordinates.applySinus = function(sinRad, cosRad, amount) {
    for (var index = 0; index < this.length; index += 1) {
        this.coordinates[index].y = this.originalCoordinates[index].y + Math.sin(sinRad) * amount;
        this.coordinates[index].x = this.originalCoordinates[index].x + Math.cos(cosRad) * amount;
    }
    return this;
};

// Create coordinates with chaining:
var myCoordinates = Object.create(Coordinates);
var coordinates = myCoordinates
    .setCoordinates([{x:400, y:300}])
    .applySinus(0, 0, 100)
    .getCoordinates();

// Draw a dot, for debugging purposes:
svgElement.drawDot(coordinates[0]);