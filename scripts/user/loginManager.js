'use strict';

var angularModule = require('../app');

angularModule.factory('loginManager', function($firebase, $firebaseSimpleLogin) {

    var firebaseReference = new Firebase('https://elfreyshira.firebaseio.com');
    var loginObj = $firebaseSimpleLogin(firebaseReference);
    var ngFireBase = $firebase(firebaseReference);

    var loggedIn = false;

    function isLoggedIn() {
        return loggedIn;
    }

    var qCurrentUser = loginObj.$getCurrentUser();
    qCurrentUser.then(function(user) {
        if (user) {
            console.log('Welcome back ' + user.email);
            loggedIn = true;
        }
        else {
            console.log('No user logged in.');
        }
    });

    var qUserFavorites = qCurrentUser.then(function(user) {
            if (user) {
                return ngFireBase.$child(['users', user.uid, 'favorites'].join('/'));
            }
        });

    function getUserFavorites() {
        return qCurrentUser.then(function(user) {
            if (user) {
                return ngFireBase.$child(['users', user.uid, 'favorites'].join('/'));
            }
        });
    }

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
        logout: logout,
        qUserFavorites: qUserFavorites,
        qCurrentUser: qCurrentUser,
        getUserFavorites: getUserFavorites
    };

});