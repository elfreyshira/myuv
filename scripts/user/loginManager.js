'use strict';

var angularModule = require('../app');

angularModule.factory('loginManager', function(firebaseManager) {

    var loginObj = firebaseManager.loginObj;
    var ngFireBase = firebaseManager.ngFireBase;

    var currentUser = false;
    var loggedIn = false;

    function isLoggedIn() {
        return loggedIn;
    }

    function login(email, password) {

        if (!email && !password) {
            return loginObj.$getCurrentUser().then(function(user) {
                if (user) {
                    console.log('Welcome back ' + user.email);
                    currentUser = user;
                    loggedIn = true;
                }
                else {
                    console.log('No user logged in.');
                }
                return user;
            });
        }

        return loginObj.$login('password', {
            email: email,
            password: password,
            rememberMe: true
        }).then(function(user) {
            console.log('Hello ' + user.email);
            currentUser = user;
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
        currentUser = false;
        loggedIn = false;
        loginObj.$logout();
    }

    function getCurrentUser() {
        return currentUser;
    }

    return {
        login: login,
        register: register,
        logout: logout,
        currentUser: currentUser,
        getCurrentUser: getCurrentUser,
        isLoggedIn: isLoggedIn
    };

});