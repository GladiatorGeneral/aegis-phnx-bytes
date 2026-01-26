// app/api/orchestrate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { VectorStore } from '@/lib/phnxaura/rag/vector-store';
import { SecurityManager } from '@/lib/phnxaura/security/rate-limiter';
import { AgentOrchestrator } from '@/lib/phnxaura/orchestrator';

const requestSchema = z.object({
  prompt: z.string().max(10000),
  namespace: z.string().regex(/^[a-z0-9-]+$/),
  agents: z.array(z.enum(['architect', 'coder', 'reviewer', 'security'])),
  modelConfig: z.object({
    primary: z.enum(['deepseek-coder', 'deepseek-reasoner', 'hf-codellama']),
    temperature: z.number().min(0).max(2).default(0.7)
  }),
  contextWindow: z.number().optional() // RAG context window size
});

export async function POST(req: NextRequest) {
  try {
    // Validation
    const body = await req.json();
    const validated = requestSchema.parse(body);
    
    // Security check
    const apiKey = req.headers.get('x-api-key') || '';
    const security = new SecurityManager();
    const auth = await security.validateRequest(apiKey, JSON.stringify(body).length);

    // Initialize RAG
    const vectorStore = new VectorStore();
    const retrievedContext = await vectorStore.retrieveRelevant(
      validated.prompt,
      validated.namespace,
      validated.contextWindow || 5
    );

    // Orchestrate with context
    const orchestrator = new AgentOrchestrator();
    const result = await orchestrator.execute({
      ...validated,
      retrievedContext,
      auditMetadata: {
        apiKeyHash: auth.keyHash,
        timestamp: new Date().toISOString()
      },
      // Ensure type checking on models, using assertion for now
      modelConfig: validated.modelConfig as any
    });

    return NextResponse.json({
      success: true,
      result,
      meta: {
        contextUsed: retrievedContext.length,
        rateLimitRemaining: auth.remaining
      }
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ error: 'Orchestration failed' }, { status: 500 });
  }
}
