export type Language = {

    code: string;
    direction: string;

};

export type Provider = {

    args: any;

};

export type Decimal = {

    minusSign: string;
    decimalSeparator: string;

};

export enum LoadingMode {

    Direct,
    Async

}

export enum ServiceState {

    isReady,
    isLoading,
    isWaiting

}

export interface PropertyDecorator {

    <T extends Function>(type: T): T;

    (target: Object, propertyKey?: string | symbol): void;

}

export interface Type<T> extends Function {

    new (...args: any[]): T;

}

export interface Token {

    localeStorage?: Type<any>;
    translationProvider?: Type<any>;
    translationHandler?: Type<any>;

}
