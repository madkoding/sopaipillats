import { Request, Response } from 'express';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

export abstract class ApiController {
  protected static allowedOrigin: string = '*';

  constructor() {
    this.sendSecurityHeaders();
  }

  private sendSecurityHeaders(): void {
    // Will be applied by middleware in Express
  }

  protected setSecurityHeaders(_req: Request, res: Response): void {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Content-Security-Policy', "default-src 'none'");

    const origin = _req.headers.origin;
    if (ApiController.allowedOrigin === '*') {
      res.setHeader('Access-Control-Allow-Origin', '*');
    } else if (origin === ApiController.allowedOrigin) {
      res.setHeader('Access-Control-Allow-Origin', origin as string);
      res.setHeader('Vary', 'Origin');
    }

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }

  protected json(data: any, _status: number = 200): { success: boolean; data?: any } {
    return {
      success: true,
      ...(Array.isArray(data) ? { data } : { data }),
    };
  }

  protected error(message: string, _status: number = 400): { success: false; error: string } {
    return {
      success: false,
      error: message,
    };
  }

  protected okOr201<T>(data: T | null, message: string = 'Processing error'): any {
    return data
      ? { success: true, data, status: 201 }
      : { success: false, error: message, status: 500 };
  }

  protected okOr404<T>(data: T | null, message: string = 'Not found'): any {
    return data
      ? { success: true, data, status: 200 }
      : { success: false, error: message, status: 404 };
  }

  protected validationError(errors: Record<string, string[]>): any {
    return {
      success: false,
      errors,
      status: 422,
    };
  }

  protected input(req: Request): any {
    return req.body;
  }

  protected async withDto<T extends object>(
    _dtoClass: ClassConstructor<T>,
    req: Request,
    callback: (dto: T) => any
  ): Promise<any> {
    const input = req.body;

    if (!input || typeof input !== 'object') {
      return this.error('Invalid or empty JSON body', 400);
    }

    const dto = plainToInstance(_dtoClass, input);
    const errors = await validate(dto);

    if (errors.length > 0) {
      const formattedErrors: Record<string, string[]> = {};
      for (const err of errors) {
        formattedErrors[err.property] = Object.values(err.constraints || {});
      }
      return this.validationError(formattedErrors);
    }

    return callback(dto);
  }

  protected sendResponse(res: Response, payload: any, status: number = 200): void {
    res.status(status).json(payload);
  }
}
