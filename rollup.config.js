import resolve from 'rollup-plugin-node-resolve';
import sourcemaps from 'rollup-plugin-sourcemaps';

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
    'rxjs/observable/merge': 'Rx.Observable',
    'rxjs/observable/concat': 'Rx.Observable'
};

export default {
    external: Object.keys(globals),
    plugins: [resolve(), sourcemaps()],
    onwarn: () => { return },
    output: {
        format: 'umd',
        name: 'ng.l10n',
        globals: globals,
        sourcemap: true,
        exports: 'named'
    }
}
