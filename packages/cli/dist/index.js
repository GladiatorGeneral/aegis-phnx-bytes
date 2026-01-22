"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const core_1 = require("@phnxbyte/core");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const program = new commander_1.Command();
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
        const inputContent = fs_1.default.readFileSync(path_1.default.resolve(options.input), 'utf-8');
        const generator = new core_1.PhnxGenerator();
        const results = await generator.generate({
            input: inputContent
        });
        const outputDir = path_1.default.resolve(options.output);
        if (!fs_1.default.existsSync(outputDir)) {
            fs_1.default.mkdirSync(outputDir, { recursive: true });
        }
        for (const result of results) {
            const filePath = path_1.default.join(outputDir, result.fileName);
            fs_1.default.writeFileSync(filePath, result.content);
            console.log(`  - Wrote ${result.fileName}`);
        }
        console.log(`✅ Successfully generated client at ${options.output}`);
    }
    catch (error) {
        console.error('❌ Generation failed:', error);
        process.exit(1);
    }
});
program.parse();
