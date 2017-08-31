# Contributing to Angular localization

 - [Issues](#issue)
 - [Pull Requests](#pr)

## <a name="issue"></a> Issues
Follow the issue template and use the [plunker template](http://embed.plnkr.co/UdKFunQFnD3TOkXp2v06/) for repro.

## <a name="pr"></a> Pull Requests
- In order to build the library:
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

- In order to serve the docs:
    ```Shell
    mkdocs serve
    ```
    See also [MkDocs](http://www.mkdocs.org/).
