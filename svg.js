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
        this.updatePolyLine(line, coordinates);
        element.appendChild(line);
        return line;
    };

    /**
     * Update coordinates of a polyline
     * @param line
     * @param {Array} coordinates
     */
    this.updatePolyLine = function(line, coordinates)
    {
        var points = [];
        for (var index in coordinates) {
            if (coordinates.hasOwnProperty(index)) {
                var coordinate = coordinates[index];
                points.push(coordinate.x + ',' + coordinate.y);
            }
        }
        line.setAttribute('points', points.join(' '));
    };

    /**
     * Draw a red dot (for debugging purposes);
     * @param coordinates
     */
    this.drawDot = function(coordinates, small)
    {
        var dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        if (small) {
            dot.setAttribute('fill', '#0066FF');
            dot.setAttribute('r', '5');
        } else {
            dot.setAttribute('fill', '#FF0000');
            dot.setAttribute('r', '10');
        }
        dot.setAttribute('stroke', 'none');
        dot.setAttribute('cx', coordinates.x);
        dot.setAttribute('cy', coordinates.y);
        element.appendChild(dot);
        return dot;
    };
}

var svgElement = new Svg('svg');