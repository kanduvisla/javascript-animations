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

var SinusCoordinates = Object.create(Coordinates);
/**
 * Apply a sinus to the coordinates
 * @param {float} amount -1 to 1
 * @param {float} height
 * @param {float} offset Offset for each step
 */
SinusCoordinates.setOffset = function(amount, height, offset)
{
    for (var index in this.coordinates) {
        if (this.coordinates.hasOwnProperty(index)) {
            this.coordinates[index].y += (Math.sin((amount + (index * offset)) * Math.PI) * height);
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
var pathCoordinates = Object.create(SinusCoordinates);
pathCoordinates.fill(line);
pathCoordinates.setOffset(0, 100, 0.25);

// Draw the line:
svgElement.drawPolyline(pathCoordinates.getCoordinates());