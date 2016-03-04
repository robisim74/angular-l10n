// Plug-ins.
const gulp = require('gulp');
const del = require('del');

// Cleans the contents of the distribution directory.
gulp.task('clean', function () {
    return del('dist/**/*');
});

// Copies dependencies.
gulp.task('copy:libs', ['clean'], function () {
    return gulp.src([
        'node_modules/es6-shim/es6-shim.min.js',
        'node_modules/systemjs/dist/system-polyfills.js',
        'node_modules/angular2/bundles/angular2-polyfills.js',
        'node_modules/systemjs/dist/system.src.js',
        'node_modules/rxjs/bundles/Rx.js',
        'node_modules/angular2/bundles/angular2.dev.js',
        'node_modules/angular2/bundles/http.dev.js',
        'node_modules/angular2/bundles/router.dev.js'
    ])
        .pipe(gulp.dest('dist/lib'))
});

gulp.task('default', ['copy:libs']);