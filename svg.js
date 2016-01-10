/**
 * Helper for SVG drawing
 * @param elementId
 * @constructor
 */
function Svg(elementId)
{
    "use strict";

    // Reference to the HTML element
    var element = document.getElementById(elementId);

    /**
     * Get the HTML Element
     * @returns {HTMLElement}
     */
    this.getElement = function()
    {
        return element;
    };

    /**
     * Draw a line on the HTML Element
     * @param {Array} coordinates
     */
    this.drawPolyline = function(coordinates)
    {
        var line = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
        line.setAttribute('stroke', '#000000');
        line.setAttribute('stroke-width', '5');
        line.setAttribute('fill', 'none');
        var points = [];
        for (var index in coordinates) {
            if (coordinates.hasOwnProperty(index)) {
                var coordinate = coordinates[index];
                points.push(coordinate.x + ',' + coordinate.y);
            }
        }
        line.setAttribute('points', points.join(' '));
        element.appendChild(line);
        return line;
    };
}

var svgElement = new Svg('svg');