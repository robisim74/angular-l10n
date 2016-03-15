/**
 * ANGULAR 2 LOCALIZATION
 * A translation service for the new Angular 2 applications using TypeScript
 * written by Roberto Simonetti
 * MIT license
 * https://github.com/robisim74/angular2localization
 */
System.register(['angular2/core', '../services/locale.service', '../services/localization.service'], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, core_2, locale_service_1, localization_service_1;
    var LocalizationPipe;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
                core_2 = core_1_1;
            },
            function (locale_service_1_1) {
                locale_service_1 = locale_service_1_1;
            },
            function (localization_service_1_1) {
                localization_service_1 = localization_service_1_1;
            }],
        execute: function() {
            /**
             * Translate pipe function.
             */
            LocalizationPipe = (function () {
                function LocalizationPipe(locale, localization) {
                    this.locale = locale;
                    this.localization = localization;
                }
                /**
                 * Translate pipe transform method.
                 *
                 * @params key The key to be translated
                 * @return The value of the translation
                 */
                LocalizationPipe.prototype.transform = function (key) {
                    var _this = this;
                    // When the language changes, updates the language code and loads the translations data for the asynchronous loading.
                    if (this.locale.getCurrentLanguage() != "" && this.locale.getCurrentLanguage() != this.localization.languageCode) {
                        this.localization.updateTranslation();
                    }
                    // Checks the service state.
                    if (this.localization.isReady) {
                        // Updates the key & the value of the translation for the key if:
                        // - the key is changed (i18n);
                        // - the value is empty;
                        // - the language is changed.
                        if (this.key != key || this.value == "" || this.languageCode != this.localization.languageCode) {
                            // i18n: remove the value of template locale variable. 
                            var formatKey = key.replace(/^\d+\b/, '');
                            formatKey = formatKey.trim();
                            // Gets the value of the translation.
                            this.localization.translate(formatKey).forEach(
                            // Next.
                            function (value) {
                                _this.value = key.replace(formatKey, value);
                            }, null).then(function () {
                                // Updates the language code for the translate pipe.
                                _this.languageCode = _this.localization.languageCode;
                                // Updates the key of the translate pipe.
                                _this.key = key;
                                return _this.value;
                            });
                        }
                        else {
                            // The value of the translation isn't changed.
                            return this.value;
                        }
                    }
                    else {
                        // The service isn't ready.
                        return this.value;
                    }
                };
                LocalizationPipe = __decorate([
                    core_2.Pipe({
                        name: 'translate',
                        pure: false // Required to update the value.
                    }),
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [locale_service_1.LocaleService, localization_service_1.LocalizationService])
                ], LocalizationPipe);
                return LocalizationPipe;
            })();
            exports_1("LocalizationPipe", LocalizationPipe);
        }
    }
});
