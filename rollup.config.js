// Rollup config file.

// Custom Rollup plugin to resolve rxjs deps.
// https://github.com/IgorMinar/new-world-test/blob/master/es6-or-ts-bundle/rollup.config.js
class RollupNG2 {
    constructor(options) {
        this.options = options;
    }
    resolveId(id, from) {
        if (id.startsWith('rxjs/')) {
            return `${__dirname}/node_modules/rxjs-es/${id.replace('rxjs/', '')}.js`;
        }
    }
}

// Custom Rollup plugin to resolve @angular2/common/scr deps.
class RollupNG2CommonSrc {
    constructor(options) {
        this.options = options;
    }
    resolveId(id, from) {
        if (id.startsWith('@angular/common/src/')) {
            return `${__dirname}/node_modules/@angular/common/esm/src/${id.replace('@angular/common/src/', '')}.js`;
        }
    }
}

const rollupNG2 = (config) => new RollupNG2(config);
const rollupNG2CommonSrc = (config) => new RollupNG2CommonSrc(config);

export default {
    entry: './dist/esm/angular2localization.js',
    dest: './dist/tmp/angular2localization.umd.js',
    format: 'umd',
    moduleName: 'ng.angular2localization',
    external: [
        '@angular/core',
        '@angular/common',
        '@angular/forms',
        '@angular/http'
    ],
    globals: {
        '@angular/core': 'ng.core',
        '@angular/common': 'ng.common',
        '@angular/forms': 'ng.forms',
        '@angular/http': 'ng.http'
    },
    plugins: [
        rollupNG2(),
        rollupNG2CommonSrc()
    ]
}