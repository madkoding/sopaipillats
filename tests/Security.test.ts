import { describe, it, expect, beforeEach } from 'vitest';
import { Security } from '../src/Sopaipilla/Security/Security.js';

describe('Security', () => {
  describe('sanitize', () => {
    it('should remove script tags', () => {
      const input = '<script>alert("xss")</script>Hello';
      const result = Security.sanitize(input);
      expect(result).toBe('Hello');
    });

    it('should remove inline event handlers', () => {
      const input = '<img onerror="alert(1)" src="x">';
      const result = Security.sanitize(input);
      expect(result).toBe('<img src="x">');
    });

    it('should remove javascript: URIs', () => {
      const input = '<a href="javascript:alert(1)">click</a>';
      const result = Security.sanitize(input);
      expect(result).toBe('<a href="">click</a>');
    });

    it('should sanitize objects recursively', () => {
      const input = {
        name: '<script>alert(1)</script>',
        nested: {
          value: '<img onerror="alert(1)">'
        }
      };
      const result = Security.sanitize(input);
      expect(result.name).toBe('');
      expect(result.nested.value).toBe('<img>');
    });

    it('should sanitize arrays', () => {
      const input = ['<script>alert(1)</script>', 'clean'];
      const result = Security.sanitize(input);
      expect(result[0]).toBe('');
      expect(result[1]).toBe('clean');
    });

    it('should not modify numbers', () => {
      const input = { count: 42, price: 99.99 };
      const result = Security.sanitize(input);
      expect(result.count).toBe(42);
      expect(result.price).toBe(99.99);
    });
  });
});
