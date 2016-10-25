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

const Linter = require("tslint");
const configuration = require('./tslint.json');
const options = {
    formatter: 'json',
    configuration: configuration
};
let program = Linter.createProgram("tsconfig.json", "src/");
let files = Linter.getFileNames(program);
let results = files.map(file => {
    let fileContents = program.getSourceFile(file).getFullText();
    let linter = new Linter(file, fileContents, options, program);
    let result = linter.lint();

    if (result.failureCount > 0) {

        let failures = JSON.parse(result.output);
        for (let i = 0; i < failures.length; i++) {
            echo('TSLint:',
                chalk.yellow(failures[i].failure),
                chalk.white('[' + failures[i].startPosition.line +
                    ', ' + failures[i].startPosition.character + ']'),
                failures[i].name);
        }

    }

});

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
