'use strict';

var angularModule = require('./app');

// var fixtures = require('./fixtures');

angularModule.controller('MainController',
    function($scope, httpRottenService, httpImdbService, httpTmdbService, httpMetacriticService, httpImdbBackupService,
        $window, getRottenByTitle, getImdbById, getImdbByTitle, getTmdbById, getMetacriticByTitle, 
        getRottenListByTitle, getRottenById) {

        // $scope.movieSearchResults = fixtures.startingResults;
        $scope.movieSearchResults = [];

        // After getting rotten, get the other sources
        function getOtherSources(movieSearchResult) {

            var imdbId = movieSearchResult.imdbId;
            var title = movieSearchResult.title;
            var releaseYear = movieSearchResult.year;
            var runtime = movieSearchResult.runtime;

            if (imdbId) {
                getImdbById(imdbId).then(function(data) {
                    movieSearchResult.sources = movieSearchResult.sources.concat(data.sources);
                });

                getTmdbById(imdbId).then(function(data){
                    movieSearchResult.sources = movieSearchResult.sources.concat(data.sources);
                });
            }
            else {
                getImdbByTitle(movieSearchResult.title, releaseYear).then(function(data) {
                    movieSearchResult.sources = movieSearchResult.sources.concat(data.sources);

                    var imdbId = data.imdbId;
                    getTmdbById(imdbId).then(function(data) {
                        movieSearchResult.sources = movieSearchResult.sources.concat(data.sources);
                    });
                });
            }

            getMetacriticByTitle(title, releaseYear, runtime).then(function(data){
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

        $scope.fetch = function(queryObj) {
            getRottenByTitle(queryObj).then(function(data) {
                resetInput();
                $scope.movieSearchResults.unshift(data);
                getOtherSources(data);
            });
        };

    });