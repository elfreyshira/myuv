'use strict';

var angularModule = require('../app');
var _ = require('lodash');


angularModule.factory('urlManager', function($location) {

    function resetHash() {
        $location.search('');
    }

    /*
    Sets a hash query in the url correlating to a movie search.
    @param queryObj {Object}
    @param?X queryObj.id {String}
    @param?X queryObj.q {String}
    */
    function setMovieUrl(queryObj) {
        if (queryObj.id) {
            resetHash();
            $location.search('id', queryObj.id);
        }
        else if (queryObj.q) {
            resetHash();
            $location.search('q', queryObj.q);
        }
    }

    function getMovieUrlHash() {
        var hashObj = $location.search();
        if (hashObj.id || hashObj.q) {
            return hashObj;
        }
        else {
            return false;
        }
    }

    return {
        setMovieUrl: setMovieUrl,
        getMovieUrlHash: getMovieUrlHash
    };

});