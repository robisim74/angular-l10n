# Angular localization
_An Angular library to translate messages, dates and numbers_

<br>

---

> This library is for localization of **Angular 2+** apps written in TypeScript, ES6 or ES5. 
It allows, in addition to translation, to localize numbers and dates of your app, adding _language code_, _country code_, _currency code_, _timezone_ and optionally _script code_, _numbering system_ and _calendar_, through [Internationalization API](spec/configuration.md#intl-api). It also implements the validation of numbers by locales.

---

> [Sample app](http://robisim74.github.io/angular-l10n-sample) built with Angular CLI & Material, and its [source code](https://github.com/robisim74/angular-l10n-sample).

---

> Library version: 4.0.0 - [Changelog](https://github.com/robisim74/angular-l10n/releases) 

<br>

---

### Installing
You can add `angular-l10n` to your project using `npm`:
```Shell
npm install angular-l10n --save 
```
To install the pre-release package:
```Shell
npm install --save angular-l10n@next
```

<br>

---

### Loading
#### Using SystemJS configuration
```JavaScript
System.config({
    map: {
        'angular-l10n': 'node_modules/angular-l10n/bundles/angular-l10n.umd.js'
    }
});
```
<br>
#### Angular CLI
No need to set up anything, just import it in your code.

<br>
#### Rollup or webpack
No need to set up anything, just import it in your code.

<br>
#### Plain JavaScript
If you build apps in Angular using ES5, you can include the `umd` bundle in your `index.html`:
```Html
<script src="node_modules/angular-l10n/bundles/angular-l10n.umd.js"></script>
```
and use global `ng.l10n` namespace.

<br>

---

### AoT compilation, Server Side Rendering & strict
This library is compatible with AoT compilation & Server Side Rendering. It also supports the `strict` TypeScript compiler option.
