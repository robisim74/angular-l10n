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
