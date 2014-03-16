'use strict';

module.exports = function(grunt) {

    var allJsFiles = ['**/*.js', '!node_modules/**'];

    grunt.initConfig({

        jshint: {
            options: {
                node: true
            },
            all: allJsFiles
        },
        watch: {
            scripts: {
                files: allJsFiles,
                tasks: ['jshint'],
                options: {
                    // spawn: false
                }
            }
        }

    });

    grunt.registerTask('test', ['jshint']);

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
};