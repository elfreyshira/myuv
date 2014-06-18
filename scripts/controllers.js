'use strict';

var angularModule = require('./app');

// var fixtures = require('./fixtures');

angularModule.controller('MainController',
    function($scope, getRottenListByTitle, fetchResults, $location,
        urlManager, $firebase, $firebaseSimpleLogin, $window) {

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
        var firebaseReference = new Firebase('https://elfreyshira.firebaseio.com');

        var loginObj = $firebaseSimpleLogin(firebaseReference);

        $scope.loggedIn = true;

        loginObj.$getCurrentUser().then(function(user) {
            if (!user) {
                $scope.loggedIn = false;
            }
        });

        $scope.register = function(email, password, repeatPassword) {
            
            if (password !== repeatPassword) {
                alert("Your passwords don't match. Come on.");
                return;
            }
            console.log('Registering...');
            loginObj.$createUser(email, password, false).then(function(user) {
                $scope.login(email, password);
            });
        };

        $scope.login = function(email, password) {
            console.log('Logging in...');
            loginObj.$login('password', {
                email: email,
                password: password
            }).then(function(user) {
                $scope.loggedIn = true;
                console.log('Hello ' + user.email);
            });

        };

        $scope.logout = function() {
            console.log('Logging out... Goodbye!');
            loginObj.$logout();
            $scope.loggedIn = false;
        };

    });
