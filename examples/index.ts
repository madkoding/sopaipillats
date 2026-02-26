import 'reflect-metadata';
import express, { Express, Request, Response, NextFunction } from 'express';
import { Env, Router, ApiController, Get, Post, Put, Delete, Security, loadDatabaseConfig, AppDatabaseConfig, setRandomSeed } from '../dist/index.js';

const databaseConfig: AppDatabaseConfig = {
  default: Env.get('DB_CONNECTION', 'sqlite') || 'sqlite',

  connections: {
    sqlite: {
      client: 'sqlite3',
      connection: {
        filename: Env.get('DB_DATABASE', ':memory:') || ':memory:',
      },
      useNullAsDefault: true,
    },
  },
};

loadDatabaseConfig(databaseConfig);

class AppController extends ApiController {
  @Get('/')
  index(_req: Request, res: Response): string {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>SopaipillaTS App</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1>SopaipillaTS Application</h1>
      <ul>
        <li><a href="/api/health">API Health</a></li>
      </ul>
    </body>
    </html>`;
  }

  @Get('/api/health')
  health(): any {
    return this.json({
      status: 'ok',
      app: 'SopaipillaTS App',
      timestamp: new Date().toISOString(),
    });
  }
}

class Application {
  private app: Express;
  private router: Router;

  constructor() {
    this.app = express();
    this.router = new Router();
    this.setupMiddleware();
  }

  private setupMiddleware(): void {
    this.app.use(express.json({ limit: '1mb' }));
    this.app.use(Security.securityHeaders);
    this.app.use(Security.cors());
  }

  registerController(controller: any): void {
    this.router.registerController(controller);
  }

  start(port?: number, host?: string): void {
    const appPort = port || parseInt(Env.get('PORT', '3000') || '3000', 10);
    const appHost = host || Env.get('HOST', '0.0.0.0') || '0.0.0.0';

    this.app.use(this.router.getExpressRouter());
    this.app.use((_req, res) => res.status(404).json({ success: false, error: 'Not Found' }));
    this.app.use((err: any, _req: Request, _res: Response, _next: NextFunction) => {
      console.error('Error:', err);
      _res.status(500).json({ success: false, error: 'Internal Server Error' });
    });

    this.app.listen(appPort, appHost, () => {
      console.log(`Server running at http://${appHost}:${appPort}`);
    });
  }
}

export function createApp(): Application {
  return new Application();
}

export function initEnv(path: string = '.env'): void {
  Env.load(path);
  
  const randomSeed = Env.get('RANDOM_SEED');
  if (randomSeed) {
    setRandomSeed(randomSeed);
  }
}

// Start the application
const application = new Application();
application.registerController(new AppController());
application.start();
