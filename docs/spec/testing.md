## Unit testing

<br>

---

There are several ways to test an app that implements this library. To provide the data, you could use:

- a _MockBackend_
- real services
- mock services

During the configuration of _Jasmine_, you could do something like this:
```TypeScript
describe('Component: HomeComponent', () => {

    let fixture: ComponentFixture<HomeComponent>;
    let comp: HomeComponent;

    let l10nLoader: L10nLoader;

    const l10nConfig: L10nConfig = {
        locale: {
            languages: [
                { code: 'en', dir: 'ltr' }
            ],
            defaultLocale: { languageCode: 'en', countryCode: 'US' },
            currency: 'USD',
            storage: StorageStrategy.Disabled
        },
        translation: {
            providers: [
                // Karma serves files from 'base' relative path.
                { type: ProviderType.Static, prefix: 'base/src/assets/locale-' }
            ],
            ...
        }
    };

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [
                ...
                HttpClientModule,
                LocalizationModule.forRoot(l10nConfig)
            ],
            declarations: [HomeComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(HomeComponent);
        comp = fixture.componentInstance;
    });

    beforeEach((done: any) => {
        l10nLoader = TestBed.get(L10nLoader);
        l10nLoader.load().then(() => done());
    });

    it('should render translated text', (() => {
        fixture.detectChanges();

        expect(...);
    }));

});
```
In this case the real services are injected, importing `LocalizationModule.forRoot` method.

The loading of configuration is in a dedicated `beforeEach`, that will be released only when the _promise_ of the `load` method of `L10nLoader` will be resolved.
