import { Express } from 'express';
import { Router } from './Sopaipilla/Routing/Router.js';
import './App/database.js';
export declare class Application {
    private app;
    private router;
    constructor();
    private setupMiddleware;
    registerController(controller: any): void;
    private setupErrorHandler;
    private setupRouteHandler;
    start(port?: number, host?: string): void;
    getExpressApp(): Express;
    getRouter(): Router;
}
export declare function createApp(): Application;
export declare function initEnv(path?: string): void;
export * from './Sopaipilla/index.js';
export * from './App/index.js';
//# sourceMappingURL=index.d.ts.map