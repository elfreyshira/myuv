'use strict';

module.exports = function(grunt) {

    var allJsFiles = ['**/*.js', '!node_modules/**', '!resources/**', '!build/**'];
    var allSassFiles = ['styles/**/*.scss'];

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
                tasks: ['jshint', 'browserify']
            },
            sass: {
                files: allSassFiles,
                tasks: ['sass']
            }
        },
        connect: {
            server: {
                options: {
                    keepalive: true,
                    open: true,
                }
            }
        },
        browserify: {
            client: {
                src: ['scripts/**/*.js'],
                dest: 'build/script.js',
                options: {
                    // require: ['angular'],
                    alias: [
                        './resources/angular.min.js:angular',
                        // './resources/angular-animate.min.js:ng-animate',
                        './resources/bootstrap-custom/ui-bootstrap-custom-tpls-0.10.0.min.js:ng-bootstrap'
                    ]
                }
            }
        },
        sass: {
            client: {
                files: {
                    'build/style.css': 'styles/main.scss'
                }
            }
        }

    });

    grunt.registerTask('test', ['jshint']);
    grunt.registerTask('default', ['jshint', 'browserify', 'sass', 'connect']);

    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
};