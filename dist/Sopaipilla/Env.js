import { config as loadDotenv } from 'dotenv';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
export class Env {
    static vars = {};
    static load(path = '.env') {
        const fullPath = resolve(path);
        if (!existsSync(fullPath)) {
            return;
        }
        try {
            const content = readFileSync(fullPath, 'utf-8');
            const lines = content.split('\n');
            for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed || trimmed.startsWith('#'))
                    continue;
                const eqIndex = trimmed.indexOf('=');
                if (eqIndex === -1)
                    continue;
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
        }
        catch {
            const result = loadDotenv({ path });
            if (result.parsed) {
                this.vars = { ...result.parsed };
            }
        }
    }
    static get(key, defaultValue) {
        const value = process.env[key];
        return value !== undefined ? value : defaultValue;
    }
    static require(key) {
        const value = this.get(key);
        if (value === undefined) {
            throw new Error(`Missing required environment variable: ${key}`);
        }
        return value;
    }
    static getInt(key, defaultValue) {
        const value = this.get(key);
        if (value === undefined) {
            return defaultValue;
        }
        const parsed = parseInt(value, 10);
        return isNaN(parsed) ? defaultValue : parsed;
    }
    static getBool(key, defaultValue) {
        const value = this.get(key);
        if (value === undefined) {
            return defaultValue;
        }
        return value.toLowerCase() === 'true' || value === '1';
    }
    static all() {
        return { ...this.vars };
    }
    static has(key) {
        return key in process.env;
    }
}
//# sourceMappingURL=Env.js.map