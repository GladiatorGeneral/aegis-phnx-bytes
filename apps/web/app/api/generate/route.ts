import { PhnxGenerator, SpecParser } from '@phnxbyte/core';
import type { OpenAPIV3 } from 'openapi-types';

export const maxDuration = 30;
export const runtime = 'nodejs';

type GenerateRequest =
  | {
      inputMethod: 'raw';
      spec: string;
    }
  | {
      inputMethod: 'url';
      url: string;
    };

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function safeFileBaseName(title?: string) {
  const base = (title || 'phnxbyte-client')
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/(^-|-$)/g, '');
  return base.length ? base : 'phnxbyte-client';
}

function pascalCase(input: string): string {
  return input
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function camelCase(input: string): string {
  const p = pascalCase(input);
  return p ? p.charAt(0).toLowerCase() + p.slice(1) : '';
}

function pathToName(path: string): string {
  const cleaned = path
    .replace(/\{([^}]+)\}/g, 'by $1')
    .replace(/^\//, '')
    .replace(/\/+$/g, '')
    .replace(/\//g, ' ');
  return cleaned.length ? cleaned : 'root';
}

function methodToVerb(method: string): string {
  switch (method.toLowerCase()) {
    case 'get':
      return 'get';
    case 'post':
      return 'create';
    case 'put':
      return 'update';
    case 'patch':
      return 'patch';
    case 'delete':
      return 'delete';
    default:
      return method.toLowerCase();
  }
}

function generateClient(doc: OpenAPIV3.Document): string {
  const lines: string[] = [];
  lines.push(`// Generated fetch client (minimal).`);
  lines.push(`// This file is dependency-free; adapt to Axios/TanStack Query if desired.`);
  lines.push('');
  lines.push('export type HttpMethod = \"GET\" | \"POST\" | \"PUT\" | \"PATCH\" | \"DELETE\";');
  lines.push('');
  lines.push('export interface ClientConfig {');
  lines.push('  baseUrl?: string;');
  lines.push('  headers?: Record<string, string>;');
  lines.push('  fetch?: typeof fetch;');
  lines.push('}');
  lines.push('');
  lines.push('export class PhnxClient {');
  lines.push('  private baseUrl: string;');
  lines.push('  private headers: Record<string, string>;');
  lines.push('  private fetchImpl: typeof fetch;');
  lines.push('');
  lines.push('  constructor(config: ClientConfig = {}) {');
  lines.push('    this.baseUrl = config.baseUrl ?? \"\";');
  lines.push('    this.headers = config.headers ?? {};');
  lines.push('    this.fetchImpl = config.fetch ?? fetch;');
  lines.push('  }');
  lines.push('');
  lines.push('  private async request<TResponse>(method: HttpMethod, path: string, init?: RequestInit): Promise<TResponse> {');
  lines.push('    const url = this.baseUrl ? new URL(path, this.baseUrl).toString() : path;');
  lines.push('    const res = await this.fetchImpl(url, {');
  lines.push('      ...init,');
  lines.push('      method,');
  lines.push('      headers: {');
  lines.push('        ...this.headers,');
  lines.push('        ...(init?.headers ?? {}),');
  lines.push('      },');
  lines.push('    });');
  lines.push('');
  lines.push('    if (!res.ok) {');
  lines.push('      const text = await res.text().catch(() => \"\");');
  lines.push('      throw new Error(`HTTP ${res.status} ${res.statusText}${text ? `: ${text}` : \"\"}`);');
  lines.push('    }');
  lines.push('');
  lines.push('    const contentType = res.headers.get(\"content-type\") ?? \"\";');
  lines.push('    if (contentType.includes(\"application/json\")) {');
  lines.push('      return (await res.json()) as TResponse;');
  lines.push('    }');
  lines.push('    return (await res.text()) as unknown as TResponse;');
  lines.push('  }');
  lines.push('');

  const paths = doc.paths ?? {};
  for (const [rawPath, pathItem] of Object.entries(paths)) {
    if (!pathItem) continue;

    const methods: Array<[string, any]> = Object.entries(pathItem).filter(([k]) =>
      ['get', 'post', 'put', 'patch', 'delete'].includes(k)
    ) as any;

    for (const [method, operation] of methods) {
      const opId: string | undefined = operation?.operationId;
      const baseName = opId ? opId : `${methodToVerb(method)} ${pathToName(rawPath)}`;
      const fnName = camelCase(baseName);

      lines.push(`  async ${fnName}<TResponse = unknown>(params?: {`);
      lines.push('    path?: Record<string, string | number>;');
      lines.push('    query?: Record<string, string | number | boolean | undefined>;');
      lines.push('    body?: unknown;');
      lines.push('    headers?: Record<string, string>;');
      lines.push('  }): Promise<TResponse> {');

      lines.push('    const pathParams = params?.path ?? {};');
      lines.push(`    let path = \`${rawPath.replace(/\{([^}]+)\}/g, '${pathParams.$1}') }\`;`);
      lines.push('');
      lines.push('    const query = params?.query ?? {};');
      lines.push('    const qs = new URLSearchParams();');
      lines.push('    for (const [k, v] of Object.entries(query)) {');
      lines.push('      if (v === undefined) continue;');
      lines.push('      qs.set(k, String(v));');
      lines.push('    }');
      lines.push('    const url = qs.size ? `${path}?${qs.toString()}` : path;');

      lines.push('');
      lines.push('    const body = params?.body;');
      lines.push('    const headers: Record<string, string> = {');
      lines.push('      ...(params?.headers ?? {}),');
      lines.push('    };');
      lines.push('');
      lines.push('    const init: RequestInit = { headers };');
      lines.push('    if (body !== undefined) {');
      lines.push('      init.body = JSON.stringify(body);');
      lines.push('      headers[\"content-type\"] = headers[\"content-type\"] ?? \"application/json\";');
      lines.push('    }');

      lines.push(`    return this.request<TResponse>(\"${method.toUpperCase()}\" as HttpMethod, url, init);`);
      lines.push('  }');
      lines.push('');
    }
  }

  lines.push('}');
  lines.push('');
  lines.push('export function createClient(config: ClientConfig = {}) {');
  lines.push('  return new PhnxClient(config);');
  lines.push('}');

  return lines.join('\n');
}

function generateHooks(doc: OpenAPIV3.Document): string {
  const lines: string[] = [];
  lines.push('// Generated React hooks (minimal, dependency-free).');
  lines.push('// For production apps, consider TanStack Query for caching & retries.');
  lines.push('');
  lines.push("import { useEffect, useMemo, useState } from 'react';");
  lines.push("import { createClient, type ClientConfig } from './client';");
  lines.push('');
  lines.push('export interface HookState<T> {');
  lines.push('  data: T | null;');
  lines.push('  error: Error | null;');
  lines.push('  loading: boolean;');
  lines.push('  refetch: () => Promise<void>;');
  lines.push('}');
  lines.push('');

  const paths = doc.paths ?? {};
  for (const [rawPath, pathItem] of Object.entries(paths)) {
    if (!pathItem) continue;

    const methods: Array<[string, any]> = Object.entries(pathItem).filter(([k]) =>
      ['get'].includes(k)
    ) as any;

    for (const [method, operation] of methods) {
      const opId: string | undefined = operation?.operationId;
      const baseName = opId ? opId : `${methodToVerb(method)} ${pathToName(rawPath)}`;
      const hookName = pascalCase(`use ${baseName}`);
      const clientFn = camelCase(opId ? opId : `${methodToVerb(method)} ${pathToName(rawPath)}`);

      lines.push(`export function ${hookName}<TResponse = unknown>(`);
      lines.push('  args?: {');
      lines.push('    config?: ClientConfig;');
      lines.push('    path?: Record<string, string | number>;');
      lines.push('    query?: Record<string, string | number | boolean | undefined>;');
      lines.push('    enabled?: boolean;');
      lines.push('  }');
      lines.push('): HookState<TResponse> {');
      lines.push('  const enabled = args?.enabled ?? true;');
      lines.push('  const client = useMemo(() => createClient(args?.config), [args?.config]);');
      lines.push('  const [data, setData] = useState<TResponse | null>(null);');
      lines.push('  const [error, setError] = useState<Error | null>(null);');
      lines.push('  const [loading, setLoading] = useState(false);');
      lines.push('');
      lines.push('  const refetch = async () => {');
      lines.push('    if (!enabled) return;');
      lines.push('    setLoading(true);');
      lines.push('    setError(null);');
      lines.push('    try {');
      lines.push(`      const res = await client.${clientFn}<TResponse>({ path: args?.path, query: args?.query });`);
      lines.push('      setData(res);');
      lines.push('    } catch (e) {');
      lines.push('      setError(e as Error);');
      lines.push('    } finally {');
      lines.push('      setLoading(false);');
      lines.push('    }');
      lines.push('  };');
      lines.push('');
      lines.push('  useEffect(() => {');
      lines.push('    void refetch();');
      lines.push('    // eslint-disable-next-line react-hooks/exhaustive-deps');
      lines.push('  }, [enabled]);');
      lines.push('');
      lines.push('  return { data, error, loading, refetch };');
      lines.push('}');
      lines.push('');
    }
  }

  return lines.join('\n');
}

function generateAdapters(): string {
  return [
    '// Generated adapters (placeholder).',
    '// Use this file to map server DTOs to client-friendly shapes.',
    '',
    'export type Adapter<TIn, TOut> = (input: TIn) => TOut;',
    '',
    'export function identity<T>(value: T): T {',
    '  return value;',
    '}',
    '',
  ].join('\n');
}

export async function POST(req: Request) {
  let body: GenerateRequest;

  try {
    body = (await req.json()) as GenerateRequest;
  } catch {
    return Response.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  let specText: string;

  if (body.inputMethod === 'raw') {
    specText = body.spec;
  } else if (body.inputMethod === 'url') {
    if (!isHttpUrl(body.url)) {
      return Response.json({ error: 'URL must be http(s).' }, { status: 400 });
    }

    const res = await fetch(body.url, {
      redirect: 'follow',
      headers: {
        accept: 'application/json, application/yaml, text/yaml, text/plain;q=0.9, */*;q=0.8',
      },
    }).catch(() => null);

    if (!res || !res.ok) {
      return Response.json({ error: 'Failed to fetch URL.' }, { status: 400 });
    }

    const text = await res.text();
    if (text.length > 5_000_000) {
      return Response.json({ error: 'Spec too large (max 5MB).' }, { status: 413 });
    }

    specText = text;
  } else {
    return Response.json({ error: 'Unsupported inputMethod.' }, { status: 400 });
  }

  if (!specText || specText.trim().length < 5) {
    return Response.json({ error: 'Spec is empty.' }, { status: 400 });
  }

  try {
    const parser = new SpecParser();
    const doc = (await parser.parse(specText)) as OpenAPIV3.Document;

    if (!parser.validate(doc as any)) {
      return Response.json({ error: 'Spec does not look like OpenAPI (missing openapi/paths).' }, { status: 400 });
    }

    const generator = new PhnxGenerator();
    const results = await generator.generate({ input: doc });

    const types = results.find((r) => r.fileName === 'types.ts')?.content ?? '';
    const validators = results.find((r) => r.fileName === 'schemas.ts')?.content ?? '';

    const hooks = generateHooks(doc);
    const client = generateClient(doc);
    const adapters = generateAdapters();

    const projectName = safeFileBaseName(doc.info?.title);

    return Response.json({
      projectName,
      files: {
        'types.ts': types,
        'client.ts': client,
        'hooks.ts': hooks,
        'schemas.ts': validators,
        'adapters.ts': adapters,
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Generation failed.';
    return Response.json({ error: msg }, { status: 500 });
  }
}
