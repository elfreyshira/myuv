'use strict';

var angularModule = require('./app');

angularModule
.directive('lazyImageBackground', function($document) {
    return {
        scope: {
            lazyImageBackground: '='
        },
        link: function link(scope, element) {
            scope.$watch('lazyImageBackground', function(newValue) {
                var img = $document[0].createElement('img');
                img.onload = function() {
                    element.css({
                        'background-image': 'url(' + this.src + ')'
                    });
                };
                img.src = newValue;
            });
        }
    };
});
