import express from 'express';
import { Env } from './Sopaipilla/Env.js';
import { Router } from './Sopaipilla/Routing/Router.js';
import { Security } from './Sopaipilla/Security/Security.js';
import { setRandomSeed } from './Sopaipilla/Security/Crypt.js';
import './App/database.js';
export class Application {
    app;
    router;
    constructor() {
        this.app = express();
        this.router = new Router();
        this.setupMiddleware();
    }
    setupMiddleware() {
        this.app.use(express.json({ limit: '1mb' }));
        this.app.use(Security.securityHeaders);
        this.app.use(Security.cors());
    }
    registerController(controller) {
        this.router.registerController(controller);
    }
    setupErrorHandler() {
        return (err, _req, res, _next) => {
            console.error('Error:', err);
            const status = err.status || err.statusCode || 500;
            const message = err.message || 'Internal Server Error';
            res.status(status).json({
                success: false,
                error: message,
            });
        };
    }
    setupRouteHandler() {
        return (_req, res) => {
            res.status(404).json({
                success: false,
                error: 'Not Found',
            });
        };
    }
    start(port, host) {
        const appPort = port || parseInt(Env.get('PORT', '3000') || '3000', 10);
        const appHost = host || Env.get('HOST', '0.0.0.0') || '0.0.0.0';
        this.app.use(this.router.getExpressRouter());
        this.app.use(this.setupRouteHandler());
        this.app.use(this.setupErrorHandler());
        this.app.listen(appPort, appHost, () => {
            console.log(`Server running at http://${appHost}:${appPort}`);
        });
    }
    getExpressApp() {
        return this.app;
    }
    getRouter() {
        return this.router;
    }
}
export function createApp() {
    return new Application();
}
export function initEnv(path = '.env') {
    Env.load(path);
    const randomSeed = Env.get('RANDOM_SEED');
    if (randomSeed) {
        setRandomSeed(randomSeed);
    }
}
export * from './Sopaipilla/index.js';
export * from './App/index.js';
//# sourceMappingURL=index.js.map