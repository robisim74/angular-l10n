export default {
    entry: './dist/index.js',
    dest: './dist/bundles/angular-l10n.umd.js',
    format: 'umd',
    moduleName: 'ng.l10n',
    external: [
        '@angular/core',
        '@angular/common',
        '@angular/forms',
        '@angular/http',
        'rxjs/Observable',
        'rxjs/Observer',
        'rxjs/Subscription',
        'rxjs/add/operator/map',
        'rxjs/add/observable/merge'
    ],
    globals: {
        '@angular/core': 'ng.core',
        '@angular/common': 'ng.common',
        '@angular/forms': 'ng.forms',
        '@angular/http': 'ng.http',
        'rxjs/Observable': 'Rx',
        'rxjs/Observer': 'Rx',
        'rxjs/Subscription': 'Rx',
        'rxjs/add/operator/map': 'Rx',
        'rxjs/add/observable/merge': 'Rx'
    },
    onwarn: () => { return }
}