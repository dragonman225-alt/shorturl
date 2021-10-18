export interface CreateShortUrlRequestData {
    url: string;
}
export interface CreateShortUrlResponseData {
    error: boolean;
    hash: string;
    message: string;
}
export declare const SHORT_URLS_API_PATH = "/api/shorturls";
export declare const REDIRECT_PATH = "/s";
//# sourceMappingURL=api.d.ts.map