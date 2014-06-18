'use strict';

var angularModule = require('./app');

// var fixtures = require('./fixtures');

angularModule.controller('MainController',
    function($scope, getRottenListByTitle, fetchResults, urlManager, loginManager) {

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

        /***
        Firebase stuff
        ****/

        $scope.isLoggedIn = loginManager.isLoggedIn;

        $scope.register = function(email, password, repeatPassword) {
            if (password !== repeatPassword) {
                alert("Your passwords don't match. Come on.");
                return;
            }
            console.log('Registering...');
            loginManager.register(email, password);
        };

        $scope.login = function(email, password) {
            console.log('Logging in...');
            loginManager.login(email, password);
        };

        $scope.logout = function() {
            console.log('Logging out... Goodbye!');
            loginManager.logout();
        };

    });
