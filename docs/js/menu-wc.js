'use strict';


customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">Angular l10n Specification</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                        <li class="link">
                            <a href="license.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>LICENSE
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/L10nIntlModule.html" data-type="entity-link">L10nIntlModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#directives-links-module-L10nIntlModule-016ee1f7727e596c97bc1286c262fa43"' : 'data-target="#xs-directives-links-module-L10nIntlModule-016ee1f7727e596c97bc1286c262fa43"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-L10nIntlModule-016ee1f7727e596c97bc1286c262fa43"' :
                                        'id="xs-directives-links-module-L10nIntlModule-016ee1f7727e596c97bc1286c262fa43"' }>
                                        <li class="link">
                                            <a href="directives/L10nDateDirective.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules">L10nDateDirective</a>
                                        </li>
                                        <li class="link">
                                            <a href="directives/L10nNumberDirective.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules">L10nNumberDirective</a>
                                        </li>
                                        <li class="link">
                                            <a href="directives/L10nTimeAgoDirective.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules">L10nTimeAgoDirective</a>
                                        </li>
                                    </ul>
                                </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-L10nIntlModule-016ee1f7727e596c97bc1286c262fa43"' : 'data-target="#xs-injectables-links-module-L10nIntlModule-016ee1f7727e596c97bc1286c262fa43"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-L10nIntlModule-016ee1f7727e596c97bc1286c262fa43"' :
                                        'id="xs-injectables-links-module-L10nIntlModule-016ee1f7727e596c97bc1286c262fa43"' }>
                                        <li class="link">
                                            <a href="injectables/L10nIntlService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>L10nIntlService</a>
                                        </li>
                                    </ul>
                                </li>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#pipes-links-module-L10nIntlModule-016ee1f7727e596c97bc1286c262fa43"' : 'data-target="#xs-pipes-links-module-L10nIntlModule-016ee1f7727e596c97bc1286c262fa43"' }>
                                            <span class="icon ion-md-add"></span>
                                            <span>Pipes</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="pipes-links-module-L10nIntlModule-016ee1f7727e596c97bc1286c262fa43"' :
                                            'id="xs-pipes-links-module-L10nIntlModule-016ee1f7727e596c97bc1286c262fa43"' }>
                                            <li class="link">
                                                <a href="pipes/L10nDateAsyncPipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">L10nDateAsyncPipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/L10nDatePipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">L10nDatePipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/L10nNumberAsyncPipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">L10nNumberAsyncPipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/L10nNumberPipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">L10nNumberPipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/L10nTimeAgoAsyncPipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">L10nTimeAgoAsyncPipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/L10nTimeAgoPipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">L10nTimeAgoPipe</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/L10nRoutingModule.html" data-type="entity-link">L10nRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/L10nTranslationModule.html" data-type="entity-link">L10nTranslationModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#directives-links-module-L10nTranslationModule-cb79618540767fe5003d5c7ef2367caf"' : 'data-target="#xs-directives-links-module-L10nTranslationModule-cb79618540767fe5003d5c7ef2367caf"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-L10nTranslationModule-cb79618540767fe5003d5c7ef2367caf"' :
                                        'id="xs-directives-links-module-L10nTranslationModule-cb79618540767fe5003d5c7ef2367caf"' }>
                                        <li class="link">
                                            <a href="directives/L10nTranslateDirective.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules">L10nTranslateDirective</a>
                                        </li>
                                    </ul>
                                </li>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#pipes-links-module-L10nTranslationModule-cb79618540767fe5003d5c7ef2367caf"' : 'data-target="#xs-pipes-links-module-L10nTranslationModule-cb79618540767fe5003d5c7ef2367caf"' }>
                                            <span class="icon ion-md-add"></span>
                                            <span>Pipes</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="pipes-links-module-L10nTranslationModule-cb79618540767fe5003d5c7ef2367caf"' :
                                            'id="xs-pipes-links-module-L10nTranslationModule-cb79618540767fe5003d5c7ef2367caf"' }>
                                            <li class="link">
                                                <a href="pipes/L10nTranslateAsyncPipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">L10nTranslateAsyncPipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/L10nTranslatePipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">L10nTranslatePipe</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/L10nValidationModule.html" data-type="entity-link">L10nValidationModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#directives-links-module-L10nValidationModule-6a932b2c4cc561b6981c34bb7aad4dd9"' : 'data-target="#xs-directives-links-module-L10nValidationModule-6a932b2c4cc561b6981c34bb7aad4dd9"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-L10nValidationModule-6a932b2c4cc561b6981c34bb7aad4dd9"' :
                                        'id="xs-directives-links-module-L10nValidationModule-6a932b2c4cc561b6981c34bb7aad4dd9"' }>
                                        <li class="link">
                                            <a href="directives/L10nValidateDateDirective.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules">L10nValidateDateDirective</a>
                                        </li>
                                        <li class="link">
                                            <a href="directives/L10nValidateNumberDirective.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules">L10nValidateNumberDirective</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/L10nAsyncPipe.html" data-type="entity-link">L10nAsyncPipe</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/L10nCache.html" data-type="entity-link">L10nCache</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/L10nDefaultLoader.html" data-type="entity-link">L10nDefaultLoader</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/L10nDefaultMissingTranslationHandler.html" data-type="entity-link">L10nDefaultMissingTranslationHandler</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/L10nDefaultStorage.html" data-type="entity-link">L10nDefaultStorage</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/L10nDefaultTranslationFallback.html" data-type="entity-link">L10nDefaultTranslationFallback</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/L10nDefaultTranslationHandler.html" data-type="entity-link">L10nDefaultTranslationHandler</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/L10nDefaultTranslationLoader.html" data-type="entity-link">L10nDefaultTranslationLoader</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/L10nDefaultUserLanguage.html" data-type="entity-link">L10nDefaultUserLanguage</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/L10nDefaultValidation.html" data-type="entity-link">L10nDefaultValidation</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/L10nIntlService.html" data-type="entity-link">L10nIntlService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/L10nLoader.html" data-type="entity-link">L10nLoader</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/L10nMissingTranslationHandler.html" data-type="entity-link">L10nMissingTranslationHandler</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/L10nRoutingLoader.html" data-type="entity-link">L10nRoutingLoader</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/L10nRoutingService.html" data-type="entity-link">L10nRoutingService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/L10nStorage.html" data-type="entity-link">L10nStorage</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/L10nTranslationFallback.html" data-type="entity-link">L10nTranslationFallback</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/L10nTranslationHandler.html" data-type="entity-link">L10nTranslationHandler</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/L10nTranslationLoader.html" data-type="entity-link">L10nTranslationLoader</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/L10nTranslationService.html" data-type="entity-link">L10nTranslationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/L10nUserLanguage.html" data-type="entity-link">L10nUserLanguage</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/L10nValidation.html" data-type="entity-link">L10nValidation</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/L10nConfig.html" data-type="entity-link">L10nConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/L10nDateTimeFormatOptions.html" data-type="entity-link">L10nDateTimeFormatOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/L10nLocale.html" data-type="entity-link">L10nLocale</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/L10nNumberFormatOptions.html" data-type="entity-link">L10nNumberFormatOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/L10nProvider.html" data-type="entity-link">L10nProvider</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/L10nSchema.html" data-type="entity-link">L10nSchema</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/L10nTranslationToken.html" data-type="entity-link">L10nTranslationToken</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/L10nValidationToken.html" data-type="entity-link">L10nValidationToken</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});