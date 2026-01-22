import { OpenAPIInternal } from '../types';
export declare class ZodGenerator {
    generate(doc: OpenAPIInternal): string;
    private schemaToZod;
    private resolveZodType;
}
