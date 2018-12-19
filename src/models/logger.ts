import { Injectable, Inject } from "@angular/core";
import { ReplaySubject } from "rxjs";

import { L10N_CONFIG, L10nConfigRef } from "./l10n-config";
import { LogLevel, Log, LOG_MESSAGES } from "./types";

@Injectable() export class Logger {

    private static level: LogLevel | null = null;

    private static buffer: ReplaySubject<Log> = new ReplaySubject<Log>();

    public static log(name: string, message: string): void {
        if (Logger.level == LogLevel.Off) return;
        Logger.buffer.next({ name: name, message: message });
    }

    constructor(@Inject(L10N_CONFIG) private configuration: L10nConfigRef) {
        Logger.level = this.configuration.logger.level || LogLevel.Off;
        if (Logger.level != LogLevel.Off) {
            Logger.buffer.subscribe((log: Log) => {
                this.send(log);
            });
        }
    }

    private send(log: Log): void {
        const message: string = `angular-l10n (${log.name}): ${LOG_MESSAGES[log.message]}`;
        (console as any)[Logger.level!](message);
    }

}
