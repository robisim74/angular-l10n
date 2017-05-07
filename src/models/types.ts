export type Language = {

    code: string;
    direction: string;

};

export type Provider = {

    path: string;
    dataFormat: string;
    webAPI: boolean;

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
