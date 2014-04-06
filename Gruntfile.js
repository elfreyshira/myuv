'use strict';

module.exports = function(grunt) {

    var allJsFiles = ['**/*.js', '!node_modules/**', '!bower_components/**', '!resources/**', '!build/**'];
    var allSassFiles = ['styles/**/*.scss'];

    grunt.initConfig({

        jshint: {
            options: {
                node: true,
                globals: {
                    angular: true
                }
            },
            all: allJsFiles
        },
        watch: {
            scripts: {
                files: allJsFiles,
                tasks: ['test', 'browserify']
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
                    alias: [
                        './bower_components/angular/angular.min.js:angular',
                        './bower_components/angular-animate/angular-animate.min.js:ng-animate',
                        './resources/bootstrap-custom/ui-bootstrap-custom-tpls-0.10.0.min.js:ng-bootstrap'
                    ]
                }
            }
        },
        copy: {
            mapping: {
                src: './bower_components/angular*/*.map',
                dest: './build/',
                flatten: true,
                expand: true,
                filter: 'isFile'
            },
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
    grunt.registerTask('default', ['test', 'browserify', 'copy', 'sass', 'connect']);

    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-copy');
};