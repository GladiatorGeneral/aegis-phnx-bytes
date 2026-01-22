import { OpenAPIInternal } from '../types';
export declare class InterfaceGenerator {
    generate(doc: OpenAPIInternal): string;
    private schemaToInterface;
    private resolveType;
}
