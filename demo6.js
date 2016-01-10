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
pathCoordinates.setOffset(0, 100, 0.25, 0);

// Draw the line:
var lineElement = svgElement.drawPolyline(pathCoordinates.getCoordinates());

// Let's animate it:
function animate(elapsedMilliseconds)
{
    var timeOffset = elapsedMilliseconds / (1000 / Math.PI);
    pathCoordinates.setOffset(0, 100, 0.25, timeOffset);
    svgElement.updatePolyLine(lineElement, pathCoordinates.getCoordinates());
    window.requestAnimationFrame(animate);
};
animate();