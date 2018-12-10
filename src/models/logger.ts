import { Injectable, Inject } from "@angular/core";
import { ReplaySubject } from "rxjs";

import { LOGGER_CONFIG, LoggerConfig } from "./l10n-config";
import { LogLevel, Log, LOG_MESSAGES } from "./types";

/**
 * The buffer is necessary to the logger because during the initialization of the decorators the services are not yet available.
 */
@Injectable() export class Logger {

    private static level: LogLevel | null = null;

    private static buffer: ReplaySubject<Log> = new ReplaySubject<Log>();

    public static log(name: string, message: string): void {
        if (Logger.level == LogLevel.Off) return;

        if (Logger.level) {
            Logger.send({ name: name, message: message });
        } else {
            Logger.buffer.next({ name: name, message: message });
        }
    }

    public static send(log: Log): void {
        const message: string = `angular-l10n (${log.name}): ${LOG_MESSAGES[log.message]}`;
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

    constructor(@Inject(LOGGER_CONFIG) private configuration: LoggerConfig) {
        Logger.level = this.configuration.level || LogLevel.Off;
        if (Logger.level != LogLevel.Off) {
            Logger.buffer.subscribe((log: Log) => {
                Logger.send(log);
            });
        }
    }

}
