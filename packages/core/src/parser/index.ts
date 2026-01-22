import { OpenAPIInternal } from '../types';
import { OpenAPIV3 } from 'openapi-types';
import yaml from 'js-yaml';

export class SpecParser {
  async parse(input: string | Record<string, any>): Promise<OpenAPIInternal> {
    if (typeof input === 'string') {
      try {
        // Try parsing as JSON first
        return JSON.parse(input) as OpenAPIInternal;
      } catch (e) {
        try {
          // If JSON fails, try YAML
          const result = yaml.load(input);
          if (typeof result !== 'object' || result === null) {
            throw new Error('Parsed YAML is not an object');
          }
          return result as OpenAPIInternal;
        } catch (yamlError) {
           throw new Error('Failed to parse input as JSON or YAML.');
        }
      }
    }
    return input as OpenAPIInternal;
  }

  validate(doc: OpenAPIInternal): boolean {
    return !!doc.openapi && !!doc.paths;
  }
}
