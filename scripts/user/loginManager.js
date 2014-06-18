'use strict';

var angularModule = require('../app');

angularModule.factory('loginManager', function($firebase, $firebaseSimpleLogin) {

    var firebaseReference = new Firebase('https://elfreyshira.firebaseio.com');
    var loginObj = $firebaseSimpleLogin(firebaseReference);

    var loggedIn = false;

    function isLoggedIn() {
        return loggedIn;
    }

    loginObj.$getCurrentUser().then(function(user) {
        if (user) {
            console.log('Welcome back ' + user.email);
            loggedIn = true;
        }
    });

    function login(email, password) {
        return loginObj.$login('password', {
            email: email,
            password: password
        }).then(function(user) {
            console.log('Hello ' + user.email);
            loggedIn = true;
            return user;
        });
    }

    function register(email, password) {
        loginObj.$createUser(email, password).then(function(user) {
            login(email, password);
        });
    }

    function logout() {
        loggedIn = false;
        loginObj.$logout();
    }

    return {
        isLoggedIn: isLoggedIn,
        login: login,
        register: register,
        logout: logout
    };

});