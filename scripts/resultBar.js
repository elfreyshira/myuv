'use strict';

var angularModule = require('./app');

var MAX_BAR_HEIGHT = 200;
var RED_COLOR = {
    red: 255,
    green: 51,
    blue: 51
};
var YELLOW_COLOR = {
    red: 255,
    green: 239,
    blue: 0
};
var GREEN_COLOR = {
    red: 127,
    green: 255,
    blue: 36
};


var min = RED_COLOR;
var mid = YELLOW_COLOR;
var max = GREEN_COLOR;

function rgbRound(num) {
    return Math.min(255, Math.round(num));
}

/*
@param {object} low: color object for the lower rating
@param {object} high: color object for the higher rating
@param {number} percentage: 0 <= x <= 1
@return {string} rgb
*/
function rgbColor(low, high, percentage) {
    
    var red = rgbRound(low.red + ((high.red - low.red) * percentage));
    var green = rgbRound(low.green + ((high.green - low.green) * percentage));
    var blue = rgbRound(low.blue + ((high.blue - low.blue) * percentage));

    return 'rgb(' + [red, green, blue].join(',') + ')';
    
}

/*
@param {number <= 1.0} percentage
@returns {object} with keys "red", "green", "blue". numerical values.
*/
function barColor(percentage) {
    var newPercent;
    if (percentage < 0.5) {
        newPercent = percentage * 2;
        return rgbColor(min, mid, newPercent);
    }
    else {
        newPercent = (percentage - 0.5) * 2;
        return rgbColor(mid, max, newPercent);
    }
}

angularModule.directive('resultBar', function() {

    /*
        <div result-bar rating="85" out-of="%"></div>
    */
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {

            var rating = parseFloat(attrs.rating);
            var outOf = (attrs.outOf === '%') ? 100 : parseInt(attrs.outOf);
            var percentage = rating/outOf;
            var absoluteHeight = percentage * MAX_BAR_HEIGHT;

            function pixel(num) {
                return num + 'px';
            }

            element.css(
                {
                    height: pixel(absoluteHeight),
                    marginTop: pixel(MAX_BAR_HEIGHT - absoluteHeight),
                    backgroundColor: barColor(percentage)
                    // backgroundColor: 'rgb(' + rating + ', 0, 90)'
                }
            );

        }
    };

});