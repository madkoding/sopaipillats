import { Request, Response, NextFunction, Router as ExpressRouter } from 'express';
import { getRouteMetadata } from './Attributes/index.js';

export interface RouteHandler {
  controller: any;
  method: string;
  handler: string | symbol;
}

export class Router {
  private expressRouter: ExpressRouter;
  private routes: Map<string, RouteHandler[]> = new Map();

  constructor() {
    this.expressRouter = ExpressRouter();
  }

  registerController(controller: any): void {
    const prototype = Object.getPrototypeOf(controller);
    const methodNames = Object.getOwnPropertyNames(prototype).filter(
      (name) => name !== 'constructor' && typeof prototype[name] === 'function'
    );

    for (const methodName of methodNames) {
      const routeConfig = getRouteMetadata(prototype, methodName);
      
      if (routeConfig) {
        const routeKey = `${routeConfig.method}:${routeConfig.path}`;
        
        if (!this.routes.has(routeKey)) {
          this.routes.set(routeKey, []);
        }
        
        this.routes.get(routeKey)!.push({
          controller,
          method: routeConfig.method,
          handler: methodName,
        });

        const httpMethod = routeConfig.method.toLowerCase() as 'get' | 'post' | 'put' | 'patch' | 'delete';
        this.expressRouter[httpMethod](
          routeConfig.path,
          this.createHandler(controller, methodName)
        );
      }
    }
  }

  private createHandler(controller: any, methodName: string | symbol) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await controller[methodName](req, res);
        
        if (result !== undefined) {
          if (res.headersSent) return;
          
          if (typeof result === 'string') {
            res.send(result);
          } else if (result && typeof result === 'object') {
            res.json(result);
          }
        }
      } catch (error) {
        next(error);
      }
    };
  }

  getExpressRouter(): ExpressRouter {
    return this.expressRouter;
  }

  getRoutes(): Map<string, RouteHandler[]> {
    return this.routes;
  }
}
