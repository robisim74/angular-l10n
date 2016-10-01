// Plugins.
var gulp = require('gulp'),
    del = require('del'),
    ts = require('gulp-typescript'),
    merge = require('merge2'),
    sourcemaps = require('gulp-sourcemaps'),
    run = require('gulp-run'),
    runSequence = require('run-sequence'),
    uglify = require('gulp-uglify'),
    pump = require('pump'),
    rename = require("gulp-rename"),
    tslint = require('gulp-tslint'),
    filter = require('gulp-filter');

// Compiler options for ngc. 
var tsBuildProject = ts.createProject('tsconfig-build.json', {
    typescript: require('typescript')
});

// build task.
gulp.task('build', ['lint'], function () {

    runSequence('clean:dist',
        'script:src',
        'bundle:umd:build',
        'bundle:umd',
        'bundle:umd:min',
        'copy:files',
        'clean:tmp');

});

gulp.task('clean:dist', function () {

    return del('dist');

});

// ngc compiler.
gulp.task('script:src', function () {

    // gulp-run: node_modules/.bin is included on the path. Supports Linux and Windows.
    return run('ngc -p tsconfig-build.json').exec();

});

gulp.task('bundle:umd:build', function () {

    // gulp-run: node_modules/.bin is included on the path. Supports Linux and Windows.
    return run('rollup -c rollup.config.js').exec();

});

gulp.task('bundle:umd', function () {

    return gulp.src('dist/tmp/angular2localization.umd.js')
        .pipe(ts({
            out: 'angular2localization.umd.js',
            target: 'es5',
            allowJs: true,
            typescript: require('typescript'),
            noResolve: true
        }))
        .pipe(gulp.dest('dist/bundles'));

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

gulp.task('clean:tmp', function () {

    return del('dist/tmp');

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
