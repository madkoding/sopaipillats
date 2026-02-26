import { Router as ExpressRouter } from 'express';
export interface RouteHandler {
    controller: any;
    method: string;
    handler: string | symbol;
}
export declare class Router {
    private expressRouter;
    private routes;
    constructor();
    registerController(controller: any): void;
    private createHandler;
    getExpressRouter(): ExpressRouter;
    getRoutes(): Map<string, RouteHandler[]>;
}
//# sourceMappingURL=Router.d.ts.map