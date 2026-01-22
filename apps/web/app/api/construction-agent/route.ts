import { generateText } from 'ai';
import { NextRequest, NextResponse } from 'next/server';
import { documentProcessorTool } from '@/lib/construction-agent/tools/document-processor';
import { regulationMonitorTool } from '@/lib/construction-agent/tools/regulation-monitor';
import { changeOrderLoggerTool } from '@/lib/construction-agent/tools/change-order-logger';
import { financeAnalyzerTool } from '@/lib/construction-agent/tools/finance-analyzer';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Increase timeout for complex agents
export const maxDuration = 60;

// Rate limiting configuration
// Ensure these environment variables are set: UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN
// If not set, we skip rate limiting for dev/demo purposes or fail gracefully.
let ratelimit: Ratelimit | null = null;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  ratelimit = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(10, '10 m'), // 10 requests per 10 minutes
  });
}

export async function POST(req: NextRequest) {
  try {
    // Rate limiting check
    if (ratelimit) {
      const ip = req.ip ?? 'anonymous';
      const { success } = await ratelimit.limit(ip);
      
      if (!success) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again later.' },
          { status: 429 }
        );
      }
    }

    const { prompt, context } = await req.json();
    
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    console.log('[ConstructionAgent] Received prompt:', prompt);

    // Main agent orchestration
    // Note: Ensure the model string corresponds to a valid provider configuration in your project.
    // e.g., if using DeepSeek via a specific provider. 
    // If 'deepseek/deepseek-v3.2-thinking' is not automatically resolved, you might need to configure a provider.
    const result = await generateText({
      model: 'deepseek/deepseek-v3.2-thinking', // Adjust provider/model as necessary for your setup
      prompt: `You are a construction AI assistant. Analyze the request and use appropriate tools.
      
Context: ${context || 'General construction project'}
User Request: ${prompt}

Available tools:
- DocumentProcessor: Extract data from invoices, contracts, change orders
- RegulationMonitor: Check compliance with building codes and standards
- ChangeOrderLogger: Create change order tickets from client messages
- FinanceAnalyzer: Analyze project cash flow and financials

Guidelines:
1. For document analysis, call DocumentProcessor with the document URL
2. For compliance questions, call RegulationMonitor with specifications
3. For client messages about changes, call ChangeOrderLogger
4. For financial questions, call FinanceAnalyzer with project ID
5. You can use multiple tools if needed for complex requests
6. Always provide a clear, actionable summary
7. If data is not available, mock it or state constraints.

Respond in a professional, concise manner appropriate for construction managers.`,
      tools: {
        documentProcessor: documentProcessorTool,
        regulationMonitor: regulationMonitorTool,
        changeOrderLogger: changeOrderLoggerTool,
        financeAnalyzer: financeAnalyzerTool,
      },
      maxSteps: 5, // Allow multi-step reasoning
      temperature: 0.3, // Keep responses focused and deterministic
    });

    console.log('[ConstructionAgent] Completed with', result.steps.length, 'steps');

    return NextResponse.json({
      response: result.text,
      steps: result.steps.map(step => ({
        toolName: step.toolName,
        toolResult: step.toolResult,
      })),
    });

  } catch (error) {
    console.error('[ConstructionAgent] Error:', error);
    return NextResponse.json(
      { error: 'Agent processing failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
