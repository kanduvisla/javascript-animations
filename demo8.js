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

// Create extruded coordinates:
var ExtrudedCoordinates = Object.create(Coordinates);
/**
 * Extrude the coordinates according to the amount
 * @param amount
 */
ExtrudedCoordinates.extrude = function(amount, taper)
{
    var count = this.coordinates.length;
    var originalAmount = amount;
    // this.reversedCoordinates = [];
    var extrudedCoordinates = [];
    var pi2 = Math.PI / 2;
    for (var index = 0; index < count; index += 1) {
        var x1 = this.coordinates[index].x;
        var y1 = this.coordinates[index].y;

        if (taper) {
            amount = originalAmount * (1 - ((index + 1) / count));
        }

        // Calculate average point:
        if (index === 0) {
            // Default rotation:
            extrudedCoordinates.push({
                x: x1 + Math.cos(this.coordinates[index].rad - pi2) * amount,
                y: y1 + Math.sin(this.coordinates[index].rad - pi2) * amount
            });
            extrudedCoordinates.unshift({
                x: x1 + Math.cos(this.coordinates[index].rad + pi2) * amount,
                y: y1 + Math.sin(this.coordinates[index].rad + pi2) * amount
            });
        } else {
            // Get the previous rotation and calculate the average:
            var avgRad = (this.coordinates[index - 1].rad + this.coordinates[index].rad) / 2;
            extrudedCoordinates.push({
                x: x1 + Math.cos(avgRad - pi2) * amount,
                y: y1 + Math.sin(avgRad - pi2) * amount
            });
            extrudedCoordinates.unshift({
                x: x1 + Math.cos(avgRad + pi2) * amount,
                y: y1 + Math.sin(avgRad + pi2) * amount
            });
        }
    }

    return extrudedCoordinates;
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
var pathCoordinates = Object.create(ExtrudedCoordinates);
pathCoordinates.fill(line);
// First we need to calculate the direction:
DirectionalCoordinates.calculateDirection.call(pathCoordinates);
// Extrude:
svgElement.drawPolyline(pathCoordinates.getCoordinates());
var extrudedCoordinates = pathCoordinates.extrude(40);

// Draw the lines:
svgElement.drawPolyline(pathCoordinates.getCoordinates());
svgElement.drawPolyline(extrudedCoordinates, true);

// Draw debug lines to show the direction of the points:
//var dots = pathCoordinates.getCoordinates();
//for (var i=0; i<dots.length; i++) {
//    svgElement.drawDot(dots[i], true);
//    dots[i].x += Math.cos(dots[i].rad) * 20;
//    dots[i].y += Math.sin(dots[i].rad) * 20;
//    svgElement.drawDot(dots[i]);
//}
