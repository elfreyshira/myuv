angular.module('myuv')

.constant('maxBarHeight', 200)
.constant('redColor', {
    red: 255,
    green: 51,
    blue: 51
})
.constant('yellowColor', {
    red: 255,
    green: 239,
    blue: 0
})
.constant('greenColor', {
    red: 127,
    green: 255,
    blue: 36
})

/*
@param {number <= 1.0} percentage
@returns {object} with keys "red", "green", "blue". numerical values.
*/
.factory('barColor', function(maxBarHeight, greenColor, yellowColor, redColor) {

    var min = redColor
    var mid = yellowColor;
    var max = greenColor;

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

    return function(percentage) {

        if (percentage < 0.5) {
            var newPercent = percentage * 2;
            return rgbColor(min, mid, newPercent);
        }
        else {
            var newPercent = (percentage - 0.5) * 2;
            return rgbColor(mid, max, newPercent);
        }
    };

})

.directive('resultBar', function(maxBarHeight, barColor) {

    /*
        <div result-bar rating="85" out-of="%"></div>
    */
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {

            var rating = parseFloat(attrs.rating);
            var outOf = (attrs.outOf === '%') ? 100 : parseInt(attrs.outOf);
            var percentage = rating/outOf;
            var absoluteHeight = percentage * maxBarHeight;

            function pixel(num) {
                return num + 'px';
            }

            element.css(
                {
                    height: pixel(absoluteHeight),
                    marginTop: pixel(maxBarHeight - absoluteHeight),
                    backgroundColor: barColor(percentage)
                    // backgroundColor: 'rgb(' + rating + ', 0, 90)'
                }
            );

        }
    }

});