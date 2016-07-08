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
    tslintConfig = require('./tslint.json');

// TypeScript compiler options. 
var tsProject = ts.createProject('tsconfig.json', {
    typescript: require('typescript')
});

// TypeScript es2015 compiler options. 
var tsES2015Project = ts.createProject('tsconfig-es2015.json', {
    typescript: require('typescript')
});

// build task.
gulp.task('build', ['lint'], function () {

    runSequence('clean:dist',
        'script:src',
        'script:esm',
        'bundle:umd:es2015',
        'bundle:umd',
        'bundle:umd:min',
        'copy:files',
        'clean:tmp');

});

gulp.task('clean:dist', function () {

    return del('dist');

});

gulp.task('script:src', function () {

    var tsResult = tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(ts(tsProject));

    return merge([
        tsResult.dts.pipe(gulp.dest('dist')),
        tsResult.js
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest('dist'))
    ]);

});

gulp.task('script:esm', function () {

    var tsResult = tsES2015Project.src()
        .pipe(sourcemaps.init())
        .pipe(ts(tsES2015Project));

    return merge([
        tsResult.dts.pipe(gulp.dest('dist/esm')),
        tsResult.js
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest('dist/esm'))
    ]);

});

gulp.task('bundle:umd:es2015', function () {

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
            noExternalResolve: true
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

    return gulp.src(['*.ts', 'src/**/*.ts'])
        .pipe(tslint({
            tslint: require('tslint').default,
            configuration: tslintConfig
        }))
        .pipe(tslint.report('prose', { emitError: true }));

});

gulp.task('default', ['build']);
