import { Command } from 'commander';
import { PhnxGenerator } from '@phnxbyte/core';
import fs from 'fs';
import path from 'path';

const program = new Command();

program
  .name('phnx')
  .description('PhnxGPT CLI - Type-safe API client generator')
  .version('0.0.1');

program
  .command('generate')
  .description('Generate TypeScript interfaces from an OpenAPI spec')
  .requiredOption('-i, --input <path>', 'Path to OpenAPI spec (JSON or YAML)')
  .option('-o, --output <path>', 'Output directory', 'generated')
  .action(async (options) => {
    try {
      console.log(`Reading spec from ${options.input}...`);
      const inputContent = fs.readFileSync(path.resolve(options.input), 'utf-8');
      
      const generator = new PhnxGenerator();
      const results = await generator.generate({
        input: inputContent
      });

      const outputDir = path.resolve(options.output);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      for (const result of results) {
        const filePath = path.join(outputDir, result.fileName);
        fs.writeFileSync(filePath, result.content);
        console.log(`  - Wrote ${result.fileName}`);
      }
      
      console.log(`✅ Successfully generated client at ${options.output}`);
    } catch (error) {
      console.error('❌ Generation failed:', error);
      process.exit(1);
    }
  });

program.parse();