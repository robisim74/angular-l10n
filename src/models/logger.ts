import { Injectable, Inject } from "@angular/core";

import { LOCALE_CONFIG, LocaleConfig } from "./l10n-config";
import { LogLevel, LOG_MESSAGES } from "./types";

@Injectable() export class Logger {

    private static level: LogLevel = LogLevel.Off;

    public static log(name: string, message: string): void {
        if (Logger.level == LogLevel.Off) return;

        message = `angular-l10n - ${name}: ${LOG_MESSAGES[message]}`;
        switch (Logger.level) {
            case LogLevel.Error:
                console.error(message);
                break;
            case LogLevel.Warn:
                console.warn(message);
                break;
            default:
                console.log(message);
        }
    }

    constructor(@Inject(LOCALE_CONFIG) private configuration: LocaleConfig) {
        if (this.configuration.logger) {
            Logger.level = this.configuration.logger;
        }
    }

}
