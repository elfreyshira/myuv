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