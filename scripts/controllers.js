'use strict';

var angularModule = require('./app');
var _ = require('lodash');

// var fixtures = require('./fixtures');

angularModule.controller('MainController',
    function($scope, getRottenListByTitle, fetchResults, urlManager, loginManager, favoritesManager) {

        // $scope.movieSearchResults = fixtures.startingResults;
        $scope.movieSearchResults = [];
        $scope.backgroundUrl = '';

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
        loginManager.login().then(function(user) {
            if (user) {
                $scope.userEmail = user.email;
            }
        });


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
            loginManager.login(email, password).then(function(user) {
                $scope.userEmail = user.email;
            });
        };

        $scope.logout = function() {
            console.log('Logging out... Goodbye!');
            loginManager.logout();
        };


        $scope.favorites = favoritesManager.getUserFavorites();

        $scope.$watch('isLoggedIn()', function(isLoggedIn) {
            if (isLoggedIn) {
                favoritesManager.populateUserFavorites();
                $scope.favorites = favoritesManager.getUserFavorites();
            }
        });

    });
