"use strict";

// ShellJS.
require('shelljs/global');

// Colors.
const chalk = require('chalk');


echo('Start building...');


/* TSLint with Codelyzer */
// https://github.com/palantir/tslint/blob/master/src/configs/recommended.ts
// https://github.com/mgechev/codelyzer
echo('Start TSLint');

exec('tslint ./src/**/*.ts -e ./src/**/*.ngfactory.ts');

echo(chalk.green('TSLint completed'));


/* Cleans dist folder */
rm('-Rf', 'dist/*');


/* Aot compilation */
echo('Start AoT compilation');
echo('ngc -p tsconfig-build.json');

exec('ngc -p tsconfig-build.json');

echo(chalk.green('AoT compilation completed'));


/* Creates umd bundle */
echo('Start bundling');
echo('rollup -c rollup.config.js');

exec('rollup -c rollup.config.js');

echo(chalk.green('Bundling completed'));


/* Minimizes umd bundle */
echo('Start minification');

exec('uglifyjs ./dist/bundles/angular2localization.umd.js -o ./dist/bundles/angular2localization.umd.min.js');

echo(chalk.green('Minification completed'));


/* Copies files */
cp('-Rf', ['package.json', 'LICENSE', 'README.md'], 'dist');


echo('End building');
