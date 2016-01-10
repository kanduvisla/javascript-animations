/**
 * OLOO approach for our coordinates object
 * @constructor
 */
var Coordinates = {
    coordinates: [],
    originalCoordinates: [],
    count: 0,
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
        this.update();
    },

    /**
     * Fill the entire coordinates array at once
     * @param {Array} arr
     */
    fill: function(arr)
    {
        // We need to use a little trick, because our array consist of literals:
        this.coordinates = JSON.parse(JSON.stringify(arr));
        this.update();
    },

    /**
     * Update inner settings
     */
    update: function()
    {
        this.originalCoordinates = JSON.parse(JSON.stringify(this.coordinates));
        this.count = this.coordinates.length;
    },

    /**
     * Reset the coordinates to their original values:
     */
    reset: function()
    {
        for (var index = 0; index < this.count; index += 1) {
            this.coordinates[index].x = this.originalCoordinates[index].x;
            this.coordinates[index].y = this.originalCoordinates[index].y;
        }
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
    // Since this was a manipulation, we need to update the original set:
    this.update();
};

var SinusCoordinates = Object.create(Coordinates);
/**
 * Apply a sinus to the coordinates
 * @param {float} amount -1 to 1
 * @param {float} height
 * @param {float} offset Offset for each step
 * @param {float} time Time offset
 * @param {boolean} taper
 */
SinusCoordinates.setOffset = function(amount, height, offset, time, taper)
{
    var originalHeight = height;
    if (!time) {
        time = 0;
    }
    var count = this.coordinates.length;
    for (var index = 0; index < count; index ++) {
        if (taper) {
            height = originalHeight * ((index) / count);
        }
        this.coordinates[index].y +=
        Math.sin(amount + time + (parseInt(index) * offset) * Math.PI) * height;
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
 * @param {boolean} taper
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

// Create rotated coordinates
RotateCoordinates = Object.create(Coordinates);
/**
 * Rotate a shape
 * @param {float} rad
 * @param {float} centerX
 * @param {float} centerY
 */
RotateCoordinates.rotate = function(rad, centerX, centerY)
{
    var count = this.coordinates.length;
    for (var index = 0; index < count; index ++) {
        var cos = Math.cos(rad);
        var sin = Math.sin(rad);
        var x = this.coordinates[index].x;
        var y = this.coordinates[index].y;
        this.coordinates[index].x = (cos * (x - centerX)) + (sin * (y - centerY)) + centerX;
        this.coordinates[index].y = (cos * (y - centerY)) - (sin * (x - centerX)) + centerY;
    }
};

// Pack it in a single object:
var Tentacle = {
    init: function(){
        // Simple path coordinates (a line with various points)
        var line = [
            {x:400, y:300},
            {x:450, y:300},
            {x:500, y:300},
            {x:550, y:300},
            {x:600, y:300},
            {x:650, y:300},
            {x:700, y:300},
            {x:750, y:300},
            {x:800, y:300}
        ];

        // Create a coordinate object:
        this.pathCoordinates = Object.create(Coordinates);
        this.pathCoordinates.fill(line);

        // Add a Sinus to it:
        SinusCoordinates.setOffset.call(this.pathCoordinates, 0, 100, 0.25, 0, true);

        // Calculate the direction:
        DirectionalCoordinates.calculateDirection.call(this.pathCoordinates);

        // Get the extruded coordinates (tapered):
        this.extrudedCoordinates = ExtrudedCoordinates.extrude.call(this.pathCoordinates, 40, true);
        this.extrudedLineElement = svgElement.drawPolyline(this.extrudedCoordinates, true);

    },
    animate: function(elapsedMilliseconds) {
        this.pathCoordinates.reset();
        var timeOffset = elapsedMilliseconds / (1000 / Math.PI);
        // Update the sinus animation:
        SinusCoordinates.setOffset.call(this.pathCoordinates, 0, 100, 0.25, timeOffset, true);
        // Update (re-calculate) the coordinate rotations:
        DirectionalCoordinates.calculateDirection.call(this.pathCoordinates);
        // Update the extruded shape:
        this.extrudedCoordinates = ExtrudedCoordinates.extrude.call(this.pathCoordinates, 40, true);
        // Update SVG:
        svgElement.updatePolyLine(this.extrudedLineElement, this.extrudedCoordinates);
    }
};

var tentacle = Object.create(Tentacle);
tentacle.init();

// Let's animate it:
function animate(elapsedMilliseconds)
{
    tentacle.animate(elapsedMilliseconds);
    window.requestAnimationFrame(animate);
};
animate();