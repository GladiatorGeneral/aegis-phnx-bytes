import { OpenAPIInternal, GeneratorOptions, GeneratedResult } from '../types';
import { SpecParser } from '../parser';
import { InterfaceGenerator } from './interfaces';
import { ZodGenerator } from './zod';

export class PhnxGenerator {
  private parser: SpecParser;
  private interfaceGen: InterfaceGenerator;
  private zodGen: ZodGenerator;

  constructor() {
    this.parser = new SpecParser();
    this.interfaceGen = new InterfaceGenerator();
    this.zodGen = new ZodGenerator();
  }

  async generate(options: GeneratorOptions): Promise<GeneratedResult[]> {
    const doc = await this.parser.parse(options.input);
    
    // Phase 1: Generate interfaces
    const interfaces = this.interfaceGen.generate(doc);
    
    // Phase 1.5: Generate Zod Schemas
    const schemas = this.zodGen.generate(doc);

    return [
      {
        fileName: 'types.ts',
        content: interfaces
      },
      {
        fileName: 'schemas.ts',
        content: schemas
      }
    ];
  }
}
