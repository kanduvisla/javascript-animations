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

var myCoordinates = Object.create(Coordinates);
var coordinates = myCoordinates
    .setCoordinates([{x:400, y:300}])
    .getCoordinates();