'use strict';

var angularModule = require('../app');

angularModule.factory('readableTime', function() {

    return function(timeInMinutes) {
        
        var readableTimeArr = [];

        var hours = Math.floor(timeInMinutes / 60);
        if (hours) {
            readableTimeArr.push(hours + ' hour' + (hours > 1 ? 's' : ''));
        }

        var minutes = (timeInMinutes % 60);
        if (minutes) {
            readableTimeArr.push(minutes + ' minute' + (minutes > 1 ? 's' : ''));
        }

        return readableTimeArr.join(' ');
    };

});