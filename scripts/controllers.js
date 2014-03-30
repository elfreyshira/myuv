require('angular');
var fixtures = require('./fixtures');

angular.module('myuv').controller('MainController',
    function($scope, httpRottenService, httpImdbService, httpTmdbService, httpMetacriticService, httpImdbBackupService,
        $window, getResultsWithTitle, getRottenByTitle, getImdbById, getTmdbById, getMetacriticByTitle) {

        $scope.movieSearchResults = fixtures.startingResults;
        // $scope.movieSearchResults = [];

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

        $scope.fetch = function() {

            // After getting rotten, get the other sources
            function getOtherSources(movieSearchResult) {

                var imdbId = movieSearchResult.imdbId;
                getImdbById(imdbId).then(function(data) {
                    movieSearchResult.sources = movieSearchResult.sources.concat(data.sources);
                });

                getTmdbById(imdbId).then(function(data){
                    movieSearchResult.sources = movieSearchResult.sources.concat(data.sources);
                });

                var title = movieSearchResult.title;
                var releaseYear = movieSearchResult.year;
                getMetacriticByTitle(title, releaseYear).then(function(data){
                    movieSearchResult.sources = movieSearchResult.sources.concat(data.sources);
                });

            }

            getRottenByTitle($scope.query).then(function(data) {

                $scope.query = '';

                var movieSearchResult = data;
                $scope.movieSearchResults.unshift(movieSearchResult);

                getOtherSources(movieSearchResult);
            });
        };

        $window.fetch = $scope.fetch;
        $window.show = function() {
            console.log(JSON.stringify($scope.movieSearchResults, null, 4));
        };

    });