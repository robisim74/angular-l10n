import resolve from 'rollup-plugin-node-resolve';
import sourcemaps from 'rollup-plugin-sourcemaps';

const globals = {
    '@angular/core': 'ng.core',
    '@angular/common': 'ng.common',
    '@angular/common/http': 'ng.commmon.http',
    '@angular/forms': 'ng.forms',
    '@angular/router': 'ng.router',
    '@angular/platform-browser': 'ng.platformBrowser',
    'rxjs': 'rxjs',
    'rxjs/operators': 'rxjs.operators'
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
        exports: 'named',
        amd: { id: 'angular-l10n' },
    }
}
