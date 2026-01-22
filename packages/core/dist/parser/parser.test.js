"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const index_1 = require("./index");
(0, vitest_1.describe)('SpecParser', () => {
    const parser = new index_1.SpecParser();
    (0, vitest_1.it)('should parse valid JSON', async () => {
        const json = '{"openapi": "3.0.0", "info": {"title": "Test", "version": "1.0.0"}, "paths": {}}';
        const result = await parser.parse(json);
        (0, vitest_1.expect)(result.openapi).toBe('3.0.0');
    });
    (0, vitest_1.it)('should parse valid YAML', async () => {
        const yaml = `
openapi: 3.0.0
info:
  title: Test YAML
  version: 1.0.0
paths: {}
`;
        const result = await parser.parse(yaml);
        (0, vitest_1.expect)(result.openapi).toBe('3.0.0');
        (0, vitest_1.expect)(result.info.title).toBe('Test YAML');
    });
    (0, vitest_1.it)('should throw on invalid input', async () => {
        const invalid = 'not json or yaml';
        await (0, vitest_1.expect)(parser.parse(invalid)).rejects.toThrow();
    });
});
