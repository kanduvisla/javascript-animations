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
Coordinates.setSinus = function(args) {
    // Set defaults:
    var sinRad = args.sinRad ? args.sinRad : Math.PI / 2;   // 1/2 pi is in the middle
    var cosRad = args.cosRad ? args.cosRad : Math.PI / 2;
    var amount = args.amount ? args.amount : 100;
    // Extra parameters:
    var sinIdxMultiplier = args.sinIdxMultiplier ? args.sinIdxMultiplier : 0;
    var cosIdxMultiplier = args.cosIdxMultiplier ? args.cosIdxMultiplier : 0;
    // Do the magic:
    for (var index = 0; index < this.length; index += 1) {
        this.coordinates[index].y += Math.sin(sinRad + index * sinIdxMultiplier) * amount;
        this.coordinates[index].x += Math.cos(cosRad + index * cosIdxMultiplier) * amount;
    }
    return this;
};

// Create coordinates with chaining:
var myCoordinates = Object.create(Coordinates);
var coordinates = myCoordinates
    .setCoordinates([
        {x:0, y:300},
        {x:50, y:300},
        {x:100, y:300},
        {x:150, y:300},
        {x:200, y:300},
        {x:250, y:300},
        {x:300, y:300},
        {x:350, y:300},
        {x:400, y:300},
        {x:450, y:300},
        {x:500, y:300},
        {x:550, y:300},
        {x:600, y:300},
        {x:650, y:300},
        {x:700, y:300},
        {x:750, y:300}
    ])
    .getCoordinates();

// Draw multiple dots, for debugging purposes:
var dots = [];
for (var index = 0; index < coordinates.length; index += 1) {
    dots.push(svgElement.drawDot(coordinates[index]))
}

/**
 * Animation function
 * @param {float} elapsedMilliseconds
 */
function animate(elapsedMilliseconds) {
    // One PI per second:
    var pi = elapsedMilliseconds / (1000 / Math.PI);
    coordinates = myCoordinates
        .reset()
        .setSinus({
            sinRad: pi,
            sinIdxMultiplier: 0.5
        })
        .getCoordinates();
    for (var index = 0; index < coordinates.length; index += 1) {
        svgElement.updateDot(dots[index], coordinates[index]);
    }
    window.requestAnimationFrame(animate);
}
animate(0);