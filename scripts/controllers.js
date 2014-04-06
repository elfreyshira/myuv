require('angular');
var fixtures = require('./fixtures');

angular.module('myuv').controller('MainController',
    function($scope, httpRottenService, httpImdbService, httpTmdbService, httpMetacriticService, httpImdbBackupService,
        $window, getRottenByTitle, getImdbById, getTmdbById, getMetacriticByTitle, 
        getRottenListByTitle, getRottenById) {

        // $scope.movieSearchResults = fixtures.startingResults;
        $scope.movieSearchResults = [];

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

            return movieSearchResult;

        }

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

        $scope.fetchAutocomplete = function(query) {

            getRottenById(query.id).then(function(data) {
                resetInput();
                $scope.movieSearchResults.unshift(data);
                getOtherSources(data);
            });
        };

        $scope.fetch = function(query) {

            getRottenByTitle(query).then(function(data) {
                resetInput();
                $scope.movieSearchResults.unshift(data);
                getOtherSources(data);
            });
        };

    });