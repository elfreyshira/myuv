'use strict';

var angularModule = require('./app');

angularModule.directive('movieResult', function() {

    return {
        scope: {
            movie: '='
        },
        link: function link(scope, element, attrs) {

            /**
            Returns a Foundation column offset depending on the length of the results,
            and only if it's the first column.

            @param {number} resultLength
            @param {boolean} $first
            @return {string}
            */
            scope.columnOffset = function(resultLength, $first) {
                return $first ? 'small-offset-' + (6 - resultLength) : '';
            };

            scope.showMoreInfo = false;
        },
        templateUrl: 'templates/movie-result.html'

    };

});