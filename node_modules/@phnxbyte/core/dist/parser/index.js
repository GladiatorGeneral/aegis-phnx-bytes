"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpecParser = void 0;
const js_yaml_1 = __importDefault(require("js-yaml"));
class SpecParser {
    async parse(input) {
        if (typeof input === 'string') {
            try {
                // Try parsing as JSON first
                return JSON.parse(input);
            }
            catch (e) {
                try {
                    // If JSON fails, try YAML
                    const result = js_yaml_1.default.load(input);
                    if (typeof result !== 'object' || result === null) {
                        throw new Error('Parsed YAML is not an object');
                    }
                    return result;
                }
                catch (yamlError) {
                    throw new Error('Failed to parse input as JSON or YAML.');
                }
            }
        }
        return input;
    }
    validate(doc) {
        return !!doc.openapi && !!doc.paths;
    }
}
exports.SpecParser = SpecParser;
