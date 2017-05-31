import resolve from 'rollup-plugin-node-resolve';

const globals = {
    '@angular/core': 'ng.core',
    '@angular/common': 'ng.common',
    '@angular/forms': 'ng.forms',
    '@angular/http': 'ng.http',
    'rxjs/Observable': 'Rx',
    'rxjs/Observer': 'Rx',
    'rxjs/Subscription': 'Rx',
    'rxjs/Subject': 'Rx',
    'rxjs/add/operator/map': 'Rx',
    'rxjs/add/operator/toPromise': 'Rx',
    'rxjs/add/observable/merge': 'Rx'
};

export default {
    entry: './dist/modules/angular-l10n.es5.js',
    dest: './dist/bundles/angular-l10n.umd.js',
    format: 'umd',
    exports: 'named',
    moduleName: 'ng.l10n',
    plugins: [resolve()],
    external: Object.keys(globals),
    globals: globals,
    onwarn: () => { return }
}