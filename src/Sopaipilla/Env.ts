import { config as loadDotenv } from 'dotenv';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

export class Env {
  private static vars: Record<string, string> = {};

  static load(path: string = '.env'): void {
    const fullPath = resolve(path);
    
    if (!existsSync(fullPath)) {
      return;
    }

    try {
      const content = readFileSync(fullPath, 'utf-8');
      const lines = content.split('\n');
      
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        
        const eqIndex = trimmed.indexOf('=');
        if (eqIndex === -1) continue;
        
        const key = trimmed.substring(0, eqIndex).trim();
        let value = trimmed.substring(eqIndex + 1).trim();
        
        if ((value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        
        if (!(key in process.env)) {
          process.env[key] = value;
          this.vars[key] = value;
        }
      }
    } catch {
      const result = loadDotenv({ path });
      if (result.parsed) {
        this.vars = { ...result.parsed };
      }
    }
  }

  static get(key: string, defaultValue?: string): string | undefined {
    const value = process.env[key];
    return value !== undefined ? value : defaultValue;
  }

  static require(key: string): string {
    const value = this.get(key);
    if (value === undefined) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
  }

  static getInt(key: string, defaultValue?: number): number | undefined {
    const value = this.get(key);
    if (value === undefined) {
      return defaultValue;
    }
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? defaultValue : parsed;
  }

  static getBool(key: string, defaultValue?: boolean): boolean | undefined {
    const value = this.get(key);
    if (value === undefined) {
      return defaultValue;
    }
    return value.toLowerCase() === 'true' || value === '1';
  }

  static all(): Record<string, string> {
    return { ...this.vars };
  }

  static has(key: string): boolean {
    return key in process.env;
  }
}
