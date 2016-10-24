// Plugins.
var gulp = require('gulp'),
    del = require('del'),
    run = require('gulp-run'),
    runSequence = require('run-sequence'),
    uglify = require('gulp-uglify'),
    pump = require('pump'),
    rename = require("gulp-rename"),
    tslint = require('gulp-tslint');

// build task.
gulp.task('build', ['lint'], function () {

    runSequence('clean:dist',
        'script:src',
        'bundle:umd',
        'bundle:umd:min',
        'copy:files');

});

gulp.task('clean:dist', function () {

    return del('dist');

});

// ngc compiler.
gulp.task('script:src', function () {

    // gulp-run: node_modules/.bin is included on the path. Supports Linux and Windows.
    return run('ngc -p tsconfig-build.json').exec();

});

gulp.task('bundle:umd', function () {

    // gulp-run: node_modules/.bin is included on the path. Supports Linux and Windows.
    return run('rollup -c rollup.config.js').exec();

});

gulp.task('bundle:umd:min', function () {

    pump([
        gulp.src('dist/bundles/angular2localization.umd.js'),
        uglify(),
        rename({
            suffix: '.min'
        }),
        gulp.dest('dist/bundles')
    ]);

});

gulp.task('copy:files', function () {

    return gulp
        .src(['package.json', 'LICENSE', 'README.md'])
        .pipe(gulp.dest('dist'));

});

// TSLint with Codelyzer.
// https://github.com/palantir/tslint/blob/master/src/configs/recommended.ts
// https://github.com/mgechev/codelyzer
gulp.task('lint', () => {

    var tslintConfig = require('./tslint.json');

    return gulp.src(['angular2localization.ts', 'src/**/*.ts'])
        .pipe(tslint({
            configuration: tslintConfig,
            tslint: require('tslint').default,
            formatter: 'prose'
        }))
        .pipe(tslint.report());

});

gulp.task('default', ['build']);
