'use strict';

module.exports = function(grunt) {

    var allJsFiles = ['**/*.js', '!node_modules/**', '!resources/**'];

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
                tasks: ['jshint']
            }
        },
        connect: {
            server: {
                options: {
                    keepalive: true,
                    open: true,
                }
            }
        }

    });

    grunt.registerTask('test', ['jshint']);

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
};