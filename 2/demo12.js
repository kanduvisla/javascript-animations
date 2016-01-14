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
    var sinIdxAddition = args.sinIdxAddition ? args.sinIdxAddition : 0;
    var cosIdxAddition = args.cosIdxAddition ? args.cosIdxAddition : 0;
    var sinIdxOffset = args.sinIdxOffset ? args.sinIdxOffset : 0;
    var cosIdxOffset = args.cosIdxOffset ? args.cosIdxOffset : 0;
    // Do the magic:
    for (var index = 0; index < this.length; index += 1) {
        this.coordinates[index].y +=
            Math.sin(sinRad + (sinIdxOffset * index) + (index * sinIdxAddition) * sinIdxMultiplier) * amount;
        this.coordinates[index].x +=
            Math.cos(cosRad + (cosIdxOffset * index) + (index * cosIdxAddition) * cosIdxMultiplier) * amount;
    }
    return this;
};

/**
 * Calculate the direction vector of the coordinates
 * @returns {Coordinates}
 */
Coordinates.calculateDirection = function() {
    for (var index = 0; index < this.length; index += 1) {
        if (index < this.length - 1) {
            // Get the X,Y of the next coordinate and calculate the atan2:
            this.coordinates[index].rad = Math.atan2(
                this.coordinates[index + 1].y - this.coordinates[index].y,
                this.coordinates[index + 1].x - this.coordinates[index].x
            );
        } else {
            // The rotation is identical to the previous rotation:
            this.coordinates[index].rad = this.coordinates[index - 1].rad;
        }
    }
    return this;
};

// Create coordinate map:
var coordinatesArray = [];
var circleCount = 20;
for (var i=0; i<circleCount; i+= 1) {
    coordinatesArray.push(
        {
            x : 200 + Math.random() * 400,
            y : 250 + Math.random() * 100,
            multiplier : Math.random() + 0.5
        }
    );
}

// Create coordinates with chaining:
var myCoordinates = Object.create(Coordinates);
var coordinates = myCoordinates
    .setCoordinates(coordinatesArray)
    .getCoordinates();

// Draw multiple dots, for debugging purposes:
var circles = [];
var index;
for (index = 0; index < coordinates.length; index += 1) {
    circles.push(
        svgElement.drawCircle(
            coordinates[index],
            {
                stroke:'none',
                fill:'#c88',
                r:50,
                cx:coordinates[index].x,
                cy:coordinates[index].y
            }
        )
    );
}
for (index = 0; index < coordinates.length; index += 1) {
    circles.push(
        svgElement.drawCircle(
            coordinates[index],
            {
                stroke:'none',
                fill:'#faa',
                r:25,
                cx:coordinates[index].x,
                cy:coordinates[index].y
            }
        )
    );
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
            sinRad: pi/2,
            cosRad: pi/2,
            sinIdxAddition: 1,
            cosIdxAddition: 1,
            sinIdxMultiplier: 1.1,
            cosIdxMultiplier: -1.1,
            amount: 50
        })
        .getCoordinates();
    for (var index = 0; index < coordinates.length; index += 1) {
        svgElement.updateCircle(
            circles[index],
            {
                cx : coordinates[index].x,
                cy : coordinates[index].y,
                r : (Math.sin(pi * coordinates[index].multiplier) + 1.5) * 50
            }
        );
        svgElement.updateCircle(
            circles[index + circleCount],
            {
                cx : coordinates[index].x,
                cy : coordinates[index].y,
                r : (Math.sin(pi * coordinates[index].multiplier) + 1.5) * 25
            }
        );
    }
    window.requestAnimationFrame(animate);
}
animate(0);