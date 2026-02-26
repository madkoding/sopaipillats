import 'reflect-metadata';
import express, { Express, Request, Response, NextFunction } from 'express';
import { Env, Router, ApiController, Get, Post, Put, Patch, Delete, Security, loadDatabaseConfig, AppDatabaseConfig, setRandomSeed } from '../dist/index.js';

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

// Simple validation functions (instead of class-validator decorators)
function validateCreateUser(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!data.name || typeof data.name !== 'string' || data.name.length < 3) {
    errors.push('name must be at least 3 characters');
  }
  if (!data.email || typeof data.email !== 'string' || !data.email.includes('@')) {
    errors.push('email must be a valid email');
  }
  
  return { valid: errors.length === 0, errors };
}

function validateUpdateUser(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (data.name !== undefined && (typeof data.name !== 'string' || data.name.length < 3)) {
    errors.push('name must be at least 3 characters');
  }
  if (data.email !== undefined && (typeof data.email !== 'string' || !data.email.includes('@'))) {
    errors.push('email must be a valid email');
  }
  
  return { valid: errors.length === 0, errors };
}

// In-memory storage for demo
let users: any[] = [];
let nextId = 1;

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
        <li><a href="/api/users">GET /api/users</a></li>
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

  @Get('/api/users')
  getUsers(): any {
    return this.json({ data: users, meta: { total: users.length } });
  }

  @Get('/api/users/:id')
  getUser(req: Request): any {
    const id = parseInt(req.params.id, 10);
    const user = users.find(u => u.id === id);
    return this.okOr404(user, 'User not found');
  }

  @Post('/api/users')
  createUser(req: Request): any {
    const validation = validateCreateUser(req.body);
    
    if (!validation.valid) {
      return this.error(validation.errors.join(', '), 400);
    }
    
    const user = { id: nextId++, ...req.body };
    users.push(user);
    return this.okOr201(user);
  }

  @Put('/api/users/:id')
  updateUser(req: Request): any {
    const id = parseInt(req.params.id, 10);
    const index = users.findIndex(u => u.id === id);
    
    if (index === -1) {
      return this.error('User not found', 404);
    }

    const validation = validateUpdateUser(req.body);
    
    if (!validation.valid) {
      return this.error(validation.errors.join(', '), 400);
    }

    users[index] = { ...users[index], ...req.body };
    return this.okOr201(users[index]);
  }

  @Patch('/api/users/:id')
  patchUser(req: Request): any {
    const id = parseInt(req.params.id, 10);
    const index = users.findIndex(u => u.id === id);
    
    if (index === -1) {
      return this.error('User not found', 404);
    }

    users[index] = { ...users[index], ...req.body };
    return this.json({ data: users[index] });
  }

  @Delete('/api/users/:id')
  deleteUser(req: Request): any {
    const id = parseInt(req.params.id, 10);
    const index = users.findIndex(u => u.id === id);
    
    if (index === -1) {
      return this.error('User not found', 404);
    }

    users.splice(index, 1);
    return this.json({ success: true, data: { deleted: true } });
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
