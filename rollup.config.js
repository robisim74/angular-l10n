// Rollup config file.

export default {
    entry: './dist/angular2localization.js',
    dest: './dist/tmp/angular2localization.umd.js',
    format: 'umd',
    moduleName: 'ng.angular2localization',
    external: [
        '@angular/core',
        '@angular/common',
        '@angular/forms',
        '@angular/http',
        'rxjs/Observable',
        'rxjs/Observer',
        'rxjs/add/operator/map'
    ],
    globals: {
        '@angular/core': 'ng.core',
        '@angular/common': 'ng.common',
        '@angular/forms': 'ng.forms',
        '@angular/http': 'ng.http',
        'rxjs/Observable': 'Rx',
        'rxjs/Observer': 'Rx',
        'rxjs/add/operator/map': 'Rx'
    },
    plugins: [
    ]
}