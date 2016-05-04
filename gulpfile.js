// Plug-ins.
var gulp = require('gulp'),
    del = require('del');

// Script paths.
var path = require("path"),
    dest = 'bundles';

// SystemJS Build Tool.
var Builder = require('systemjs-builder');

var builder = new Builder();

var config = {
    baseURL: path.baseURL,
    defaultJSExtensions: true,
    map: {
        '@angular': 'node_modules/@angular',
        'rxjs': 'node_modules/rxjs'
    },
    paths: {
        'angular2localization/*': '*.js',
    },
    meta: {
        'node_modules/@angular/*': { build: false },
        'node_modules/rxjs/*': { build: false }
    }
};

builder.config(config);

// Clean task: cleans the contents of the bundles directory.
gulp.task('clean', function () {

    return del(dest);

});

// Bundles task: creates files.
gulp.task('bundles', ['clean'], function () {

    // Creates js file.
    builder.bundle('angular2localization/angular2localization', dest + '/angular2localization.js', { minify: false, sourceMaps: false });
    // Creates minified js file.
    builder.bundle('angular2localization/angular2localization', dest + '/angular2localization.min.js', { minify: true, sourceMaps: false });

});

gulp.task('default', ['bundles']);