import { OpenAPIV3 } from 'openapi-types';
export type OpenAPIInternal = OpenAPIV3.Document;
export interface GeneratorOptions {
    input: string | OpenAPIInternal;
    output?: string;
    format?: boolean;
}
export interface GeneratedResult {
    fileName: string;
    content: string;
}
