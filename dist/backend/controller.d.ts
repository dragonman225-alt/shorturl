import { RequestHandler } from 'express';
import { CreateShortUrlRequestData, CreateShortUrlResponseData } from './api';
interface ControllerOptions {
    blacklistHosts: string[];
}
export declare class Controller {
    private blacklistHosts;
    constructor(options?: ControllerOptions);
    createUrl: RequestHandler<undefined, CreateShortUrlResponseData, CreateShortUrlRequestData>;
    findUrlAndRedirect: RequestHandler<{
        shortHash: string;
    }>;
}
export {};
//# sourceMappingURL=controller.d.ts.map