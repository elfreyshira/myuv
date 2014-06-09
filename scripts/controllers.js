'use strict';

var angularModule = require('./app');

// var fixtures = require('./fixtures');

angularModule.controller('MainController',
    function($scope, getRottenListByTitle, fetchResults, $location, urlManager) {

        // $scope.movieSearchResults = fixtures.startingResults;
        $scope.movieSearchResults = [];

        function resetInput() {
            $scope.queryObj = '';
        }


        /**
            Returns a Foundation column offset depending on the length of the results,
            and only if it's the first column.

            @param {number} resultLength
            @param {boolean} $first
            @return {string}
        */
        $scope.columnOffset = function(resultLength, $first) {
            return $first ? 'small-offset-' + (6 - resultLength) : '';
        };

        $scope.autocomplete = function(query) {
            return getRottenListByTitle(query);
        };

        $scope.fetchResults = function(queryObj) {
            return fetchResults($scope, queryObj, resetInput);
        };

        var movieHashQueryObj = urlManager.getMovieUrlHash();
        if (movieHashQueryObj) {
            $scope.fetchResults(movieHashQueryObj);
        }

    });