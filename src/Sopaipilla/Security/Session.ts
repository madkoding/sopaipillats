import { Request, Response } from 'express';
import { randomBytes } from 'crypto';

const SESSION_STORE = new Map<string, { data: Record<string, any>; expires: number }>();
const SESSION_COOKIE_NAME = 'sopaipilla_sid';
const DEFAULT_MAX_AGE = 24 * 60 * 60 * 1000;

export class Session {
  private req: Request;
  private res: Response;
  private sessionId: string | null = null;
  private data: Record<string, any> = {};
  private dirty: boolean = false;

  constructor(req: Request, res: Response) {
    this.req = req;
    this.res = res;
    this.init();
  }

  private init(): void {
    const cookieHeader = this.req.headers.cookie;
    if (cookieHeader) {
      const cookies = this.parseCookies(cookieHeader);
      const sessionId = cookies[SESSION_COOKIE_NAME];
      
      if (sessionId && SESSION_STORE.has(sessionId)) {
        const session = SESSION_STORE.get(sessionId)!;
        if (session.expires > Date.now()) {
          this.sessionId = sessionId;
          this.data = session.data;
        } else {
          SESSION_STORE.delete(sessionId);
        }
      }
    }

    if (!this.sessionId) {
      this.sessionId = randomBytes(32).toString('hex');
      this.setCookie();
    }
  }

  private parseCookies(cookieHeader: string): Record<string, string> {
    const cookies: Record<string, string> = {};
    cookieHeader.split(';').forEach((cookie) => {
      const [name, ...rest] = cookie.split('=');
      if (name && rest.length > 0) {
        cookies[name.trim()] = rest.join('=').trim();
      }
    });
    return cookies;
  }

  private setCookie(maxAge: number = DEFAULT_MAX_AGE): void {
    const expires = new Date(Date.now() + maxAge).toUTCString();
    const isSecure = this.req.protocol === 'https';
    
    this.res.setHeader(
      'Set-Cookie',
      `${SESSION_COOKIE_NAME}=${this.sessionId}; Path=/; HttpOnly; SameSite=Lax${isSecure ? '; Secure' : ''}; Expires=${expires}`
    );
  }

  get(key: string): any {
    return this.data[key];
  }

  set(key: string, value: any): void {
    this.data[key] = value;
    this.dirty = true;
  }

  has(key: string): boolean {
    return key in this.data;
  }

  delete(key: string): void {
    delete this.data[key];
    this.dirty = true;
  }

  destroy(): void {
    if (this.sessionId) {
      SESSION_STORE.delete(this.sessionId);
      this.sessionId = null;
      this.data = {};
      this.dirty = true;
      this.setCookie(0);
    }
  }

  save(): void {
    if (this.sessionId && this.dirty) {
      SESSION_STORE.set(this.sessionId, {
        data: this.data,
        expires: Date.now() + DEFAULT_MAX_AGE,
      });
      this.dirty = false;
    }
  }

  regenerate(): void {
    if (this.sessionId) {
      SESSION_STORE.delete(this.sessionId);
    }
    this.sessionId = randomBytes(32).toString('hex');
    this.data = {};
    this.dirty = true;
    this.setCookie();
  }

  getAll(): Record<string, any> {
    return { ...this.data };
  }

  static cleanup(): void {
    const now = Date.now();
    for (const [id, session] of SESSION_STORE.entries()) {
      if (session.expires <= now) {
        SESSION_STORE.delete(id);
      }
    }
  }
}

setInterval(() => Session.cleanup(), 60 * 60 * 1000);
