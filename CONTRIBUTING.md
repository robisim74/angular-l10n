# Contributing to Angular localization

 - [Issues](#issue)
 - [Pull Requests](#pr)

## <a name="issue"></a> Issues
Just follow the issue template.

## <a name="pr"></a> Pull Requests
Principles:
- _Clean code_
- _KISS_

In order to build the library:
```Shell
npm install
npm test
npm run build
```
To test locally the npm package:
```Shell
npm run pack-lib
```
Then you can install it in your app to test it:
```Shell
npm install [path]angular-l10n-[version].tgz
```