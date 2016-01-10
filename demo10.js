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

var SinusCoordinates = Object.create(Coordinates);
/**
 * Apply a sinus to the coordinates
 * @param {float} amount -1 to 1
 * @param {float} height
 * @param {float} offset Offset for each step
 * @param {float} time Time offset
 */
SinusCoordinates.setOffset = function(amount, height, offset, time)
{
    // Always use the original coordinates to departure from:
    if (this.originalCoordinates === undefined) {
        this.originalCoordinates = JSON.parse(JSON.stringify(this.coordinates));
    }
    if (!time) {
        time = 0;
    }
    for (var index in this.coordinates) {
        if (this.coordinates.hasOwnProperty(index)) {
            this.coordinates[index].y = this.originalCoordinates[index].y +
            Math.sin(amount + time + (parseInt(index) * offset) * Math.PI) * height;
        }
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
    {x:100, y:300},
    {x:200, y:300},
    {x:300, y:300},
    {x:400, y:300},
    {x:500, y:300},
    {x:600, y:300},
    {x:700, y:300},
    {x:800, y:300}
];

// Now let's join it all together:

// Create a coordinate object:
var pathCoordinates = Object.create(Coordinates);
pathCoordinates.fill(line);

// Randomize it:
RandomizedCoordinates.randomize.call(pathCoordinates);

// Add a Sinus to it:
SinusCoordinates.setOffset.call(pathCoordinates, 0, 100, 0.25, 0);

// Calculate the direction:
DirectionalCoordinates.calculateDirection.call(pathCoordinates);

// Get the extruded coordinates (tapered):
var extrudedCoordinates = ExtrudedCoordinates.extrude.call(pathCoordinates, 40, true);
var extrudedLineElement = svgElement.drawPolyline(extrudedCoordinates, true);

// Draw the original line:
var lineElement = svgElement.drawPolyline(pathCoordinates.getCoordinates());

// Let's animate it:
function animate(elapsedMilliseconds)
{
    var timeOffset = elapsedMilliseconds / (1000 / Math.PI);
    // Update the sinus animation:
    SinusCoordinates.setOffset.call(pathCoordinates, 0, 100, 0.25, timeOffset);
    // Update (re-calculate) the coordinate rotations:
    DirectionalCoordinates.calculateDirection.call(pathCoordinates);
    // Update the extruded shape:
    extrudedCoordinates = ExtrudedCoordinates.extrude.call(pathCoordinates, 40, true);

    // Update SVG:
    svgElement.updatePolyLine(lineElement, pathCoordinates.getCoordinates());
    svgElement.updatePolyLine(extrudedLineElement, extrudedCoordinates, true);
    window.requestAnimationFrame(animate);
};
animate();