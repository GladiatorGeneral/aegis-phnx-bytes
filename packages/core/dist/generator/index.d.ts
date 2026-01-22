import { GeneratorOptions, GeneratedResult } from '../types';
export declare class PhnxGenerator {
    private parser;
    private interfaceGen;
    private zodGen;
    constructor();
    generate(options: GeneratorOptions): Promise<GeneratedResult[]>;
}
