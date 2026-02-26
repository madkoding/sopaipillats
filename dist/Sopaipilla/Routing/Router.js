import { Router as ExpressRouter } from 'express';
import { getRouteMetadata } from './Attributes/index.js';
export class Router {
    expressRouter;
    routes = new Map();
    constructor() {
        this.expressRouter = ExpressRouter();
    }
    registerController(controller) {
        const prototype = Object.getPrototypeOf(controller);
        const methodNames = Object.getOwnPropertyNames(prototype).filter((name) => name !== 'constructor' && typeof prototype[name] === 'function');
        for (const methodName of methodNames) {
            const routeConfig = getRouteMetadata(prototype, methodName);
            if (routeConfig) {
                const routeKey = `${routeConfig.method}:${routeConfig.path}`;
                if (!this.routes.has(routeKey)) {
                    this.routes.set(routeKey, []);
                }
                this.routes.get(routeKey).push({
                    controller,
                    method: routeConfig.method,
                    handler: methodName,
                });
                const httpMethod = routeConfig.method.toLowerCase();
                this.expressRouter[httpMethod](routeConfig.path, this.createHandler(controller, methodName));
            }
        }
    }
    createHandler(controller, methodName) {
        return async (req, res, next) => {
            try {
                const result = await controller[methodName](req, res);
                if (result !== undefined) {
                    if (res.headersSent)
                        return;
                    if (typeof result === 'string') {
                        res.send(result);
                    }
                    else if (result && typeof result === 'object') {
                        res.json(result);
                    }
                }
            }
            catch (error) {
                next(error);
            }
        };
    }
    getExpressRouter() {
        return this.expressRouter;
    }
    getRoutes() {
        return this.routes;
    }
}
//# sourceMappingURL=Router.js.map