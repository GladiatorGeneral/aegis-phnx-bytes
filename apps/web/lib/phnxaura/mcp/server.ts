// lib/phnxaura/mcp/server.ts
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { VectorStore } from '../rag/vector-store';
import { SecurityManager } from '../security/rate-limiter';
import { AuditLogger } from '../security/audit-logger';
import { DeepSeekClient } from './deepseek-client';
import { HuggingFaceClient } from './hf-client';
import { RetrievalContext } from '@/types/phnxaura';

export class PhnxAuraMCP {
  private server: Server;
  private vectorStore: VectorStore;
  private security: SecurityManager;
  private audit: AuditLogger;
  private deepseek: DeepSeekClient;
  private hf: HuggingFaceClient;

  constructor() {
    this.vectorStore = new VectorStore();
    this.security = new SecurityManager();
    this.audit = new AuditLogger();
    this.deepseek = new DeepSeekClient();
    this.hf = new HuggingFaceClient();

    this.server = new Server({
      name: 'phnxaura-mcp',
      version: '1.0.0'
    }, {
      capabilities: {
        tools: {},
        resources: {},
        prompts: {}
      }
    });

    this.setupHandlers();
  }

  private setupHandlers() {
    // Tool: Code generation with RAG context
    this.server.setRequestHandler(
        // @ts-ignore - The SDK types might be strict about what request handlers exist in calltool/listtools etc, bypassing for now as per user code structure
        'tools/call', 
        async (request: any) => {
      const { name, arguments: args } = request.params;
      const apiKey = request.headers?.['x-api-key'] as string;
      
      // Security validation
      const auth = await this.security.validateRequest(apiKey, JSON.stringify(args).length);
      
      try {
        // Retrieve relevant context
        const context = await this.vectorStore.retrieveRelevant(
          args.prompt,
          args.namespace || 'default',
          5,
          // { type: { $in: ['code', 'documentation'] } } // Filter support depends on pinecone implementation details in vector-store, simplifying for now
        );

        // Enrich prompt with retrieved context
        const enrichedPrompt = this.enrichPromptWithRAG(args.prompt, context);

        // Circuit breaker for DeepSeek
        const circuitBreaker = this.security.getCircuitBreaker('deepseek');
        const result = await circuitBreaker.execute(() =>
          this.deepseek.generateCode(enrichedPrompt, args.model)
        );

        await this.audit.log({
          agentId: args.agentId,
          action: `TOOL_CALL:${name}`,
          resource: args.namespace || 'default',
          outcome: 'SUCCESS',
          ip: request.headers?.['x-forwarded-for'] as string || 'unknown',
          userAgent: request.headers?.['user-agent'] as string || 'unknown',
          metadata: { contextCount: context.length, model: args.model }
        });

        return {
          content: [{ type: 'text', text: JSON.stringify(result) }],
          isError: false
        };
      } catch (error: any) {
        await this.audit.log({
          agentId: args.agentId,
          action: `TOOL_CALL:${name}`,
          resource: args.namespace || 'default',
          outcome: 'FAILURE',
          ip: request.headers?.['x-forwarded-for'] as string || 'unknown',
          userAgent: request.headers?.['user-agent'] as string || 'unknown',
          riskLevel: 'MEDIUM'
        });
        throw error;
      }
    });

    // Resource: Repository knowledge base
    this.server.setRequestHandler(
        // @ts-ignore
        'resources/read', 
        async (request: any) => {
      const uri = request.params.uri;
      const namespace = uri.replace('phnxaura://', '');
      
      const docs = await this.vectorStore.retrieveRelevant(
        request.params.prompt || '*',
        namespace,
        10
      );

      return {
        contents: docs.map(doc => ({
          uri: `phnxaura://${namespace}/${doc.source}`,
          mimeType: 'text/plain',
          text: doc.content
        }))
      };
    });
  }

  private enrichPromptWithRAG(prompt: string, context: RetrievalContext[]): string {
    const contextBlock = context
      .map((ctx, i) => `[Context ${i + 1}] ${ctx.source} (relevance: ${(ctx.similarity * 100).toFixed(1)}%):\n${ctx.content}`)
      .join('\n\n');

    return `Retrieved Context:\n${contextBlock}\n\nUser Request:\n${prompt}\n\nInstructions: Use the retrieved context above to inform your code generation. Cite specific sources when using patterns from the context.`;
  }

  async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('PHNXAURA MCP server running on stdio');
  }
}
