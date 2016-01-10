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

// Calculate the directions (radians) of the coordinates
var DirectionalCoordinates = Object.create(Coordinates);
/**
 * This utility calculates the direction for each coordinate.
 * When doing this, we 'enrich' the object containing the coordinates
 */
DirectionalCoordinates.calculateDirection = function()
{
    var count = this.coordinates.length;
    for (var index = 0; index < count; index += 1) {
        if (index < count - 1) {
            // Get the X,Y of the next coordinate and calculate the atan2:
            this.coordinates[index].rad = Math.atan2(
                this.coordinates[index + 1].y - this.coordinates[index].y,
                this.coordinates[index + 1].x - this.coordinates[index].x
            );
        } else {
            // The rotation is zero:
            this.coordinates[index].rad = 0;
        }
    }
};

// Simple path coordinates (a line with various points)
var line = [
    {x:0, y:300},
    {x:100, y:200},
    {x:200, y:400},
    {x:300, y:500},
    {x:400, y:350},
    {x:500, y:400},
    {x:600, y:300},
    {x:700, y:100},
    {x:800, y:300}
];

// Create a coordinate object:
var pathCoordinates = Object.create(DirectionalCoordinates);
pathCoordinates.fill(line);
pathCoordinates.calculateDirection();

// Draw the line:
var lineElement = svgElement.drawPolyline(pathCoordinates.getCoordinates());

// Draw debug lines to show the direction of the points:
var dots = pathCoordinates.getCoordinates();
for (var i=0; i<dots.length; i++) {
    svgElement.drawDot(dots[i], true);
    dots[i].x += Math.cos(dots[i].rad) * 20;
    dots[i].y += Math.sin(dots[i].rad) * 20;
    svgElement.drawDot(dots[i]);
}
