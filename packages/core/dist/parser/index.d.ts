import { OpenAPIInternal } from '../types';
export declare class SpecParser {
    parse(input: string | Record<string, any>): Promise<OpenAPIInternal>;
    validate(doc: OpenAPIInternal): boolean;
}
