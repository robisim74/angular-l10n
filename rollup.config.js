import resolve from 'rollup-plugin-node-resolve';

const globals = {
    '@angular/core': 'ng.core',
    '@angular/common': 'ng.common',
    '@angular/common/http': 'ng.commmon.http',
    '@angular/forms': 'ng.forms',
    'rxjs/Observable': 'Rx',
    'rxjs/Observer': 'Rx',
    'rxjs/Subscription': 'Rx',
    'rxjs/Subject': 'Rx',
    'rxjs/BehaviorSubject': 'Rx',
    'rxjs/ReplaySubject': 'Rx',
    'rxjs/add/observable/merge': 'Rx.Observable',
    'rxjs/add/observable/concat': 'Rx.Observable',
    'rxjs/add/operator/toPromise': 'Rx.Observable.prototype'
};

export default {
    input: './dist/modules/angular-l10n.es5.js',
    external: Object.keys(globals),
    plugins: [resolve()],
    onwarn: () => { return },
    output: {
        file: './dist/bundles/angular-l10n.umd.js',
        format: 'umd',
        name: 'ng.l10n',
        globals: globals,
        exports: 'named'
    }
}
