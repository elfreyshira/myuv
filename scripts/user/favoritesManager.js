'use strict';

var angularModule = require('../app');

angularModule.factory('favoritesManager', function(firebaseManager, loginManager) {

    var userFavorites = {};

    function populateUserFavorites() {
        var currentUser = loginManager.getCurrentUser();

        if (currentUser) {
            var userUid = currentUser.uid;
            userFavorites =  firebaseManager.ngFireBase.$child(['users', userUid, 'favorites'].join('/'));
        }
    }

    function getUserFavorites() {
        return userFavorites;
    }

    return {
        populateUserFavorites: populateUserFavorites,
        getUserFavorites: getUserFavorites,
        userFavorites: userFavorites
    };

});
