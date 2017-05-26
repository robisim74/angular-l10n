import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

/**
 * Implement this class-interface to create a custom provider for translation data.
 */
@Injectable() export abstract class TranslationProvider {

    /**
     * This method must contain the logic of data access.
     * @param language The current language
     * @param args The parameter of addCustomProvider method
     * @return An observable of an object of translation data: {key: value}
     */
    public abstract getTranslation(language: string, args: any): Observable<any>;

}

@Injectable() export class HttpTranslationProvider implements TranslationProvider {

    constructor(private http: Http) { }

    public getTranslation(language: string, args: any): Observable<any> {
        let url: string = "";

        switch (args.type) {
            case "WebAPI":
                url += args.path + language;
                break;
            default:
                url += args.prefix + language + "." + args.dataFormat;
        }

        return this.http.get(url)
            .map((res: Response) => res.json());
    }

}
