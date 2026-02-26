import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Env } from '../src/Sopaipilla/Env.js';
import { writeFileSync, unlinkSync, existsSync } from 'fs';
import { join } from 'path';

describe('Env', () => {
  const testEnvPath = join(process.cwd(), '.env.test');

  afterEach(() => {
    if (existsSync(testEnvPath)) {
      unlinkSync(testEnvPath);
    }
    delete process.env.TEST_VAR;
    delete process.env.ANOTHER_VAR;
  });

  describe('load', () => {
    it('should load variables from .env file', () => {
      writeFileSync(testEnvPath, 'TEST_VAR=value\nANOTHER_VAR=123');
      Env.load(testEnvPath);
      expect(Env.get('TEST_VAR')).toBe('value');
      expect(Env.get('ANOTHER_VAR')).toBe('123');
    });

    it('should handle quoted values', () => {
      writeFileSync(testEnvPath, 'TEST_VAR="quoted value"\nSINGLE=\'single quoted\'');
      Env.load(testEnvPath);
      expect(Env.get('TEST_VAR')).toBe('quoted value');
      expect(Env.get('SINGLE')).toBe('single quoted');
    });

    it('should ignore comments', () => {
      writeFileSync(testEnvPath, '# This is a comment\nTEST_VAR=value');
      Env.load(testEnvPath);
      expect(Env.get('TEST_VAR')).toBe('value');
    });

    it('should return default value when key not found', () => {
      writeFileSync(testEnvPath, 'TEST_VAR=value');
      Env.load(testEnvPath);
      expect(Env.get('MISSING', 'default')).toBe('default');
    });

    it('should return undefined when key not found without default', () => {
      writeFileSync(testEnvPath, 'TEST_VAR=value');
      Env.load(testEnvPath);
      expect(Env.get('MISSING')).toBeUndefined();
    });
  });

  describe('get', () => {
    it('should get string value', () => {
      writeFileSync(testEnvPath, 'TEST_VAR=hello');
      Env.load(testEnvPath);
      expect(Env.get('TEST_VAR')).toBe('hello');
    });
  });

  describe('getInt', () => {
    it('should parse integer values', () => {
      writeFileSync(testEnvPath, 'NUM=42');
      Env.load(testEnvPath);
      expect(Env.getInt('NUM')).toBe(42);
    });

    it('should return default for non-numeric values', () => {
      writeFileSync(testEnvPath, 'NOT_NUM=abc');
      Env.load(testEnvPath);
      expect(Env.getInt('NOT_NUM', 0)).toBe(0);
    });
  });

  describe('getBool', () => {
    it('should parse true values', () => {
      writeFileSync(testEnvPath, 'FLAG=true');
      Env.load(testEnvPath);
      expect(Env.getBool('FLAG')).toBe(true);
    });

    it('should parse 1 as true', () => {
      writeFileSync(testEnvPath, 'FLAG=1');
      Env.load(testEnvPath);
      expect(Env.getBool('FLAG')).toBe(true);
    });
  });

  describe('require', () => {
    it('should return value when key exists', () => {
      writeFileSync(testEnvPath, 'REQUIRED=value');
      Env.load(testEnvPath);
      expect(Env.require('REQUIRED')).toBe('value');
    });

    it('should throw when key missing', () => {
      writeFileSync(testEnvPath, 'OTHER=value');
      Env.load(testEnvPath);
      expect(() => Env.require('MISSING')).toThrow('Missing required environment variable: MISSING');
    });
  });

  describe('has', () => {
    it('should return true for existing key', () => {
      writeFileSync(testEnvPath, 'EXISTS=value');
      Env.load(testEnvPath);
      expect(Env.has('EXISTS')).toBe(true);
    });

    it('should return false for missing key', () => {
      writeFileSync(testEnvPath, 'EXISTS=value');
      Env.load(testEnvPath);
      expect(Env.has('MISSING')).toBe(false);
    });
  });
});
