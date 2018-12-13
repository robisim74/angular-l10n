# SEO by locales

Import the modules you need in the application root module:
```TypeScript
@NgModule({
    imports: [
        ...
        TranslationModule.forRoot(l10nConfig)
        LocaleSeoModule.forRoot()
    ],
    ...
})
export class AppModule { }
```

> The order is important: always import `LocaleSeoModule` after `TranslationModule` or `LocalizationModule`.

## Localized routing 
In _locale-adaptive_ apps (like the apps that use this library, that return different content based on the preferred locale of the visitor), _Google might not crawl, index, or rank all the content for different locales_.

To solve this problem, you can enable localized routing during configuration:
```TypeScript
const l10nConfig: L10nConfig = {
    ...
    localizedRouting: {
        format: [ISOCode.Language, /* ISOCode.Script, */ /* ISOCode.Country */]
    }
};
```

**Features:**

* A prefix is added to the path of each navigation, containing the language or the locale, creating a semantic URL:
```
baseHref[language[-script][-country]]path

https://example.com/en/home
https://example.com/en-US/home
```
* If the localized link is called, the content is automatically translated.
* When the language changes, the link is also updated.
* Changes to localized links do not change browser history.
* It works also with SSR.

To achieve this, the router configuration in your app is not rewritten (operation that would poor performance and could cause errors): the `Location` class provided by Angular is used for the replacement of the URL, in order to provide the different contents localized both to the crawlers and to the users that can refer to the localized links.

> Since the link contains only the locale, if your app also uses _numbering system_, _calendar_, _currency_ or _timezone_, you should set _schema_ option below.

### Using _hreflang_ and _sitemap_
You can use the _sitemap_ to tell Google all of the locale variants for each URL:
```XML
<?xml version="1.0" encoding="utf-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://example.com/en/home</loc>
    <xhtml:link rel="alternate" hreflang="it" href="https://example.com/en/home"/>
    <xhtml:link rel="alternate" hreflang="en" href="https://example.com/it/home"/>
    ...
    <xhtml:link rel="alternate" hreflang="x-default" href="https://example.com/home"/>
  </url>
  <url>
    <loc>https://example.com/it/home</loc>
    ...
  </url>
  ...
</urlset>
```

For more info, visit [Search Console Help - International](https://support.google.com/webmasters/topic/2370587?hl=en&ref_topic=4598733)

### Default routing
If you don't want a localized routing for default language or locale, you can enable it during the configuration:
```TypeScript
const l10nConfig: L10nConfig = {
    ...
    localizedRouting: {
        format: [ISOCode.Language, /* ISOCode.Script, */ /* ISOCode.Country */],
        defaultRouting: true
    }
};
```

### Schema
If your app uses _numbering system_, _calendar_, _currency_ or _timezone_, it is recommended to provide the `schema` option, to manage the localized links and refreshes:
```TypeScript
const l10nConfig: L10nConfig = {
    ...
    localizedRouting: {
        format: [ISOCode.Language, ISOCode.Country],
        schema: [
            { text: 'United States', languageCode: 'en', countryCode: 'US', currency: 'USD' },
            { text: 'Italia', languageCode: 'it', countryCode: 'IT', currency: 'EUR' },
        ]
    }
};
```

---

## Translation of _title_ and meta tags
To translate the _title_ and other meta tags you can use the `Search` decorator, passing the key _path_ of the page:
```TypeScript
@Search('home')
@Component({
    template: ``
})
class HomeComponent implements OnInit {

    ngOnInit(): void { }

}
```

> To use AoT compilation you have to implement OnInit, and to cancel subscriptions OnDestroy, even if they are empty.

Basically, only the _title_ is translated. To translate meta tags, you must pass them during configuration, both for the `forRoot` and `forChild` method:
```TypeScript
const l10nConfig: L10nConfig = {
    ...
    translation: {
        ...
        composedKeySeparator: '.'
    },
    search: {
        metaTags: ['description']
    }
};
```

_JSON_:
```
{
    "home": {
        "title": "Angular localization",
        "description": "An Angular library to translate messages, dates and numbers"
    }
}
```

---

## Translation of JSON-LD structured data
To translate structured data in JSON-LD format, you can use the `l10n-json-ld` component, passing the key _path_ of the schema:
```TypeScript
@Component({
    template: `<l10n-json-ld path="corporationSchema"></l10n-json-ld>`
})
class HomeComponent { }
```

_JSON_:
```
{
    "corporationSchema": {
        "@context": "http://schema.org",
        "@type": "Corporation",
        "name": "New Artisan",
        "description": "Design and development of web applications"
    }
}
```

> Note that Google _Structured Data Testing tool_ won't work, because it only renders `index.html`, but the crawlers do.
