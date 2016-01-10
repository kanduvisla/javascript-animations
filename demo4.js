/**
 * OLOO approach for our coordinates object
 * @constructor
 */
var Coordinates = {
    coordinates: [],
    /**
     * Method to retrieve all the coordinates
     * @returns {Array}
     */
    getCoordinates: function()
    {
        return this.coordinates;
    },

    /**
     * Append a position to the coordinates
     * @param {float} x
     * @param {float} y
     */
    add: function(x, y)
    {
        this.coordinates.push({x:x, y:y});
    },

    /**
     * Fill the entire coordinates array at once
     * @param {Array} arr
     */
    fill: function(arr)
    {
        // We need to use a little trick, because our array consist of literals:
        this.coordinates = JSON.parse(JSON.stringify(arr));
    }
};

/**
 * Create a simple randomizer that gives all coordinates a random offset
 * @type {Coordinates}
 */
var RandomizedCoordinates = Object.create(Coordinates);
RandomizedCoordinates.randomize = function()
{
    for (var index in this.coordinates) {
        if (this.coordinates.hasOwnProperty(index)) {
            this.coordinates[index].x += (Math.random() * 40) - 20;
            this.coordinates[index].y += (Math.random() * 40) - 20;
        }
    }
};

// Simple path coordinates (a line with various points)
var line = [
    {x:0, y:300},
    {x:100, y:300},
    {x:200, y:300},
    {x:300, y:300},
    {x:400, y:300},
    {x:500, y:300},
    {x:600, y:300},
    {x:700, y:300},
    {x:800, y:300}
];

// Create a coordinate object:
var pathCoordinates = Object.create(RandomizedCoordinates);
pathCoordinates.fill(line);
// Randomize it:
pathCoordinates.randomize();

// Draw the line:
svgElement.drawPolyline(pathCoordinates.getCoordinates());