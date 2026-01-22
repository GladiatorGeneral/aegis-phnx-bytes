"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhnxGenerator = void 0;
const parser_1 = require("../parser");
const interfaces_1 = require("./interfaces");
const zod_1 = require("./zod");
class PhnxGenerator {
    parser;
    interfaceGen;
    zodGen;
    constructor() {
        this.parser = new parser_1.SpecParser();
        this.interfaceGen = new interfaces_1.InterfaceGenerator();
        this.zodGen = new zod_1.ZodGenerator();
    }
    async generate(options) {
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
exports.PhnxGenerator = PhnxGenerator;
