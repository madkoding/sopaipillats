# SopaipillaTS

> A lightweight, zero-dependency TypeScript framework for building JSON APIs.

---

## Features

- **Decorator-based routing** — `@Get()`, `@Post()`, `@Put()`, `@Patch()`, `@Delete()`
- **DTO validation** — class-validator with decorators
- **Express integration** — built on top of Express
- **Knex.js ORM** — query builder with SQLite, MySQL, and PostgreSQL support
- **Security by default** — XSS sanitization, HTTP method whitelist, secure headers, AES-256-GCM encryption
- **Environment config** — .env loader
- **Type-safe** — Full TypeScript support

---

## Requirements

| Requirement | Version |
|---|---|
| Node.js | 18 or higher |
| npm | 9 or higher |

---

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start the server
npm run dev
```

Visit `http://localhost:3000/api/health` to confirm the app is running.

---

## Project Structure

```
.
├── src/
│   ├── index.ts                   # Entry point
│   │
│   ├── Sopaipilla/                # Framework core
│   │   ├── Env.ts                 # .env loader
│   │   ├── Http/
│   │   │   └── ApiController.ts   # Base controller
│   │   ├── Database/
│   │   │   ├── Model.ts           # Base model
│   │   │   └── Connection.ts      # Knex connection
│   │   ├── Routing/
│   │   │   ├── Router.ts          # Router
│   │   │   └── Attributes/        # Get, Post, Put, Patch, Delete
│   │   ├── Security/
│   │   │   ├── Security.ts        # XSS, HTTP hardening
│   │   │   ├── Crypt.ts           # AES-256-GCM encryption
│   │   │   └── Session.ts         # Session management
│   │   └── Validation/
│   │       ├── ValidationException.ts
│   │       └── index.ts           # class-validator exports
│   │
│   └── App/                       # Example application
│       ├── AppController.ts
│       ├── database.ts
│       └── Users/
│           ├── UsersController.ts
│           ├── UsersModel.ts
│           └── DTO/
│
├── package.json
├── tsconfig.json
└── .env.example
```

---

## Creating a Resource Module

### 1. Model

```typescript
// App/Posts/PostsModel.ts
import { Model } from 'sopaipilla';

export class PostsModel extends Model {
  protected static table = 'posts';
  protected static primaryKey = 'id';
  protected static fillable = ['title', 'body'];
  protected static schema = [
    'id INTEGER PRIMARY KEY AUTOINCREMENT',
    'title TEXT NOT NULL',
    'body TEXT',
  ];
}
```

### 2. DTO

```typescript
// App/Posts/DTO/CreatePostDTO.ts
import { IsString, MinLength, MaxLength } from 'sopaipilla';

export class CreatePostDTO {
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  title!: string;

  @IsString()
  body!: string;
}
```

### 3. Controller

```typescript
// App/Posts/PostsController.ts
import { Request, Response } from 'express';
import { ApiController } from 'sopaipilla';
import { Get, Post, Delete } from 'sopaipilla';
import { PostsModel } from './PostsModel';
import { CreatePostDTO } from './DTO/CreatePostDTO';

export class PostsController extends ApiController {
  constructor() {
    super();
    PostsModel.migrate();
  }

  @Get('/api/posts')
  async index() {
    const data = await PostsModel.all();
    return this.json({ data, meta: { total: data.length } });
  }

  @Post('/api/posts')
  async store(req: Request) {
    return this.withDto(CreatePostDTO, req, async (dto) => {
      const post = await PostsModel.create(dto);
      return this.okOr201(post);
    });
  }

  @Delete('/api/posts/:id')
  async destroy(req: Request) {
    const id = parseInt(req.params.id, 10);
    const deleted = await PostsModel.delete(id);
    return deleted
      ? { success: true, data: { deleted: true } }
      : this.error('Post not found', 404);
  }
}
```

### 4. Register the controller

```typescript
// src/index.ts
import { createApp, initEnv } from './index.js';
import { AppController } from './App/AppController.js';
import { UsersController } from './App/Users/UsersController.js';

initEnv();

const app = createApp();
app.registerController(new AppController());
app.registerController(new UsersController());
app.start();
```

---

## ApiController Helpers

| Method | Description |
|---|---|
| `$this->json(data, status)` | JSON response with success: true |
| `$this->error(message, status)` | JSON error response |
| `$this->okOr201(data)` | 201 Created or 500 on falsy |
| `$this->okOr404(data, msg)` | 200 OK or 404 Not Found on falsy |
| `$this->withDto(dtoClass, req, callback)` | Validate input via DTO, then execute callback |
| `$this->validationError(errors)` | 422 response with validation errors |

---

## Routing

Routes are defined via TypeScript Decorators on controller methods:

```typescript
@Get('/api/resource')
@Post('/api/resource')
@Put('/api/resource/:id')
@Patch('/api/resource/:id')
@Delete('/api/resource/:id')
```

URL parameters are automatically extracted and available via `req.params`:

```typescript
@Get('/api/users/:userId/posts/:postId')
async show(req: Request) {
  const { userId, postId } = req.params;
  // ...
}
```

---

## Validation Rules

Using class-validator decorators:

| Decorator | Description |
|---|---|
| `@IsString()` | Must be a string |
| `@IsEmail()` | Must be a valid email |
| `@MinLength(n)` | Minimum string length |
| `@MaxLength(n)` | Maximum string length |
| `@IsInt()` | Must be an integer |
| `@IsPositive()` | Must be a positive number |
| `@IsIn(['a', 'b'])` | Must be one of the allowed values |
| `@IsOptional()` | Field is optional |

---

## Security

| Layer | Implementation |
|---|---|
| Input sanitization | XSS patterns stripped from request body |
| HTTP method whitelist | TRACE, CONNECT and custom methods return 405 |
| Session cookies | httponly, samesite=Lax, secure (when HTTPS) |
| HTTP security headers | X-Content-Type-Options, X-Frame-Options, CSP, Referrer-Policy |
| Encryption | AES-256-GCM (authenticated) |
| Password hashing | bcrypt |
| Token generation | randomBytes (CSPRNG) |

---

## Database Support

### SQLite
```env
DB_CONNECTION=sqlite
DB_DATABASE=:memory:
```

### MySQL
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=sopaipilla
DB_USERNAME=root
DB_PASSWORD=
```

### PostgreSQL
```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_NAME=sopaipilla
DB_USERNAME=postgres
DB_PASSWORD=
```

---

## License

MIT © [madKoding](https://github.com/madkoding)
