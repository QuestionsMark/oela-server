export interface ServerResponse {
    message: string;
    problems?: string[];
}

export interface ClientResponseOK {
    status: true;
    message: string;
}
export interface ClientResponseError {
    status: false;
    message: string;
    problems?: string[];
}
export type ClientResponse = ClientResponseOK | ClientResponseError;

export interface ClientApiResponseOK<T> {
    status: true;
    results: T;
    count?: number;
}
export interface ClientApiResponseError {
    status: false;
    message: string;
}
export type ClientApiResponse<T> = ClientApiResponseOK<T> | ClientApiResponseError;

export interface PaginationResponse<T> {
    results: T;
    count: number;
}