'use strict';

var angularModule = require('../app');

angularModule.factory('firebaseManager', function($firebase, $firebaseSimpleLogin) {

    var firebaseReference = new Firebase('https://elfreyshira.firebaseio.com');
    var loginObj = $firebaseSimpleLogin(firebaseReference);
    var ngFireBase = $firebase(firebaseReference);

    return {
        firebaseReference: firebaseReference,
        loginObj: loginObj,
        ngFireBase: ngFireBase
    };
});