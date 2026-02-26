import { Request, Response, NextFunction } from 'express';

const XSS_PATTERNS = [
  /<script[^>]*?>.*?<\/script>/gi,
  /\s+on\w+\s*=\s*["'][^"']*["']/gi,
  /\s+on\w+\s*=\s*[^\s>]+/gi,
  /href\s*=\s*(["']?)javascript:[^"'>\s]*\1/gi,
  /src\s*=\s*(["']?)data:[^"'>\s]*\1/gi,
  /<iframe|object|embed|applet|form|base[^>]*>/gi,
  /&#(\d+);/g,
];

const ALLOWED_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'];

export class Security {
  static cleanAll(req: Request, res: Response, next: NextFunction): void {
    if (req.query && typeof req.query === 'object') {
      const queryString = JSON.stringify(req.query);
      if (queryString.includes('\0')) {
        res.status(400).json({ success: false, error: 'Bad Request' });
        return;
      }
    }

    const method = req.method.toUpperCase();
    if (!ALLOWED_METHODS.includes(method)) {
      res.setHeader('Allow', ALLOWED_METHODS.join(', '));
      res.status(405).json({ success: false, error: 'Method Not Allowed' });
      return;
    }

    if (req.body && typeof req.body === 'object') {
      req.body = this.sanitize(req.body);
    }

    next();
  }

  static sanitize(value: any): any {
    if (Array.isArray(value)) {
      return value.map((item) => this.sanitize(item));
    }
    
    if (value && typeof value === 'object') {
      const sanitized: Record<string, any> = {};
      for (const [key, val] of Object.entries(value)) {
        sanitized[key] = this.sanitize(val);
      }
      return sanitized;
    }
    
    if (typeof value === 'string') {
      let sanitized = value;
      for (const pattern of XSS_PATTERNS) {
      sanitized = sanitized.replace(pattern, (match) => {
        if (match.startsWith('href')) {
          return 'href=""';
        }
        return '';
      });
      }
      return sanitized.trim();
    }
    
    return value;
  }

  static securityHeaders(_req: Request, res: Response, next: NextFunction): void {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Content-Security-Policy', "default-src 'none'");
    next();
  }

  static cors(allowedOrigin: string = '*') {
    return (req: Request, res: Response, next: NextFunction): void => {
      const origin = req.headers.origin;
      
      if (allowedOrigin === '*') {
        res.setHeader('Access-Control-Allow-Origin', '*');
      } else if (origin === allowedOrigin) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Vary', 'Origin');
      }

      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

      if (req.method === 'OPTIONS') {
        res.status(204).end();
        return;
      }

      next();
    };
  }
}
