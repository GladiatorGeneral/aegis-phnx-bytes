import { describe, it, expect } from 'vitest';
import { SpecParser } from './index';

describe('SpecParser', () => {
  const parser = new SpecParser();

  it('should parse valid JSON', async () => {
    const json = '{"openapi": "3.0.0", "info": {"title": "Test", "version": "1.0.0"}, "paths": {}}';
    const result = await parser.parse(json);
    expect(result.openapi).toBe('3.0.0');
  });

  it('should parse valid YAML', async () => {
    const yaml = `
openapi: 3.0.0
info:
  title: Test YAML
  version: 1.0.0
paths: {}
`;
    const result = await parser.parse(yaml);
    expect(result.openapi).toBe('3.0.0');
    expect(result.info.title).toBe('Test YAML');
  });

  it('should throw on invalid input', async () => {
    const invalid = 'not json or yaml';
    await expect(parser.parse(invalid)).rejects.toThrow();
  });
});
