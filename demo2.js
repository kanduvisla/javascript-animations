/**
 * Create a closure for our coordinates object
 * @constructor
 */
function Coordinates()
{
    var coordinates = [];

    /**
     * Method to retrieve all the coordinates
     * @returns {Array}
     */
    this.getCoordinates = function()
    {
        return coordinates;
    };

    /**
     * Append a position to the coordinates
     * @param {float} x
     * @param {float} y
     */
    this.add = function(x, y)
    {
        coordinates.push({x:x, y:y});
    };

    /**
     * Fill the entire coordinates array at once
     * @param {Array} arr
     */
    this.fill = function(arr)
    {
        // We need to use a little trick, because our array consist of literals:
        coordinates = JSON.parse(JSON.stringify(arr));
    };
}

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
var pathCoordinates = new Coordinates();
pathCoordinates.fill(line);

// Draw the line:
svgElement.drawPolyline(pathCoordinates.getCoordinates());