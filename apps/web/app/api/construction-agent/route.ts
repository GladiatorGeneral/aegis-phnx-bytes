import { generateText } from 'ai';
import { NextRequest, NextResponse } from 'next/server';
import { rlmSystemPrompt } from '@/lib/construction-agent/prompts/rlm-controller';
import { 
  TIER1_FRAMEWORKS, 
  TIER1_GOVERNANCE,
  TIER2_METHODOLOGIES,
  TIER3_TOOLS,
  PROMPTS,
  calculateEVM,
  calculateMarkup,
  getTierForQuery,
} from '@/lib/construction-agent/prompts/mcp-prompts';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Increase timeout for complex agents
export const maxDuration = 60;

// Rate limiting configuration
let ratelimit: Ratelimit | null = null;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  ratelimit = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(10, '10 m'),
  });
}

/**
 * Build context-aware prompt based on query classification
 */
function buildContextualPrompt(query: string, context?: string): string {
  const tier = getTierForQuery(query);
  const lowerQuery = query.toLowerCase();
  
  let additionalContext = '';
  
  // Add relevant framework context based on query keywords
  if (lowerQuery.includes('evm') || lowerQuery.includes('earned value') || lowerQuery.includes('cost performance')) {
    additionalContext += `\n\nRELEVANT FRAMEWORK - Earned Value Management:\n${JSON.stringify(TIER1_FRAMEWORKS.EARNED_VALUE_MANAGEMENT, null, 2)}`;
  }
  
  if (lowerQuery.includes('critical path') || lowerQuery.includes('schedule') || lowerQuery.includes('delay')) {
    additionalContext += `\n\nRELEVANT FRAMEWORK - Critical Path Method:\n${JSON.stringify(TIER1_FRAMEWORKS.CRITICAL_PATH_METHOD, null, 2)}`;
  }
  
  if (lowerQuery.includes('risk')) {
    additionalContext += `\n\nRELEVANT FRAMEWORK - Risk Management:\n${JSON.stringify(TIER1_FRAMEWORKS.RISK_MANAGEMENT, null, 2)}`;
  }
  
  if (lowerQuery.includes('change order') || lowerQuery.includes('co ')) {
    additionalContext += `\n\nRELEVANT METHODOLOGY - Change Order Evaluation:\n${JSON.stringify(TIER2_METHODOLOGIES.CHANGE_ORDER_EVALUATION, null, 2)}`;
  }
  
  if (lowerQuery.includes('aia') || lowerQuery.includes('contract')) {
    additionalContext += `\n\nRELEVANT GOVERNANCE - AIA Contracts:\n${JSON.stringify(TIER1_GOVERNANCE.AIA_CONTRACTS, null, 2)}`;
  }
  
  if (lowerQuery.includes('safety') || lowerQuery.includes('osha')) {
    additionalContext += `\n\nRELEVANT GOVERNANCE - OSHA Construction Standards:\n${JSON.stringify(TIER1_GOVERNANCE.OSHA_CONSTRUCTION, null, 2)}`;
  }
  
  if (lowerQuery.includes('leed') || lowerQuery.includes('green') || lowerQuery.includes('sustainability')) {
    additionalContext += `\n\nRELEVANT GOVERNANCE - LEED Certification:\n${JSON.stringify(TIER1_GOVERNANCE.LEED, null, 2)}`;
  }

  return `${rlmSystemPrompt}

═══════════════════════════════════════════════════════════════════════════════
CURRENT QUERY CONTEXT
═══════════════════════════════════════════════════════════════════════════════

Query Tier Classification: TIER ${tier}
Project Context: ${context || 'General construction project'}
${additionalContext}

═══════════════════════════════════════════════════════════════════════════════
USER QUERY
═══════════════════════════════════════════════════════════════════════════════

${query}

═══════════════════════════════════════════════════════════════════════════════
INSTRUCTIONS
═══════════════════════════════════════════════════════════════════════════════

Analyze this query using the Three-Tier MCP Architecture. Apply the appropriate 
frameworks, methodologies, or calculations based on the tier classification.

Structure your response according to the response schema in the system prompt.
Provide actionable recommendations and next steps.`;
}

/**
 * Process EVM calculations if detected in query
 */
function processEVMIfNeeded(query: string): { hasEVM: boolean; evmData?: ReturnType<typeof calculateEVM> } {
  const evmPattern = /bac[:\s]+\$?([\d,]+).*?pv[:\s]+\$?([\d,]+).*?ev[:\s]+\$?([\d,]+).*?ac[:\s]+\$?([\d,]+)/i;
  const match = query.match(evmPattern);
  
  if (match) {
    const bac = parseFloat(match[1].replace(/,/g, ''));
    const pv = parseFloat(match[2].replace(/,/g, ''));
    const ev = parseFloat(match[3].replace(/,/g, ''));
    const ac = parseFloat(match[4].replace(/,/g, ''));
    
    return {
      hasEVM: true,
      evmData: calculateEVM(bac, pv, ev, ac),
    };
  }
  
  return { hasEVM: false };
}

export async function POST(req: NextRequest) {
  try {
    // Rate limiting check
    if (ratelimit) {
      const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'anonymous';
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
    
    // Classify the query
    const tier = getTierForQuery(prompt);
    console.log('[ConstructionAgent] Query classified as Tier:', tier);
    
    // Pre-process any EVM calculations
    const evmResult = processEVMIfNeeded(prompt);
    
    // Build the contextual prompt
    const systemPrompt = buildContextualPrompt(prompt, context);
    
    // Add EVM pre-calculations if available
    let enhancedPrompt = prompt;
    if (evmResult.hasEVM && evmResult.evmData) {
      enhancedPrompt += `\n\nPRE-CALCULATED EVM METRICS:\n${JSON.stringify(evmResult.evmData, null, 2)}`;
    }

    // Generate response using the MCP architecture
    const result = await generateText({
      model: 'openai/gpt-4o', // Using GPT-4o for complex reasoning
      system: systemPrompt,
      prompt: enhancedPrompt,
      temperature: 0.3,
    });

    console.log('[ConstructionAgent] Response generated successfully');

    return NextResponse.json({
      response: result.text,
      metadata: {
        tier,
        queryType: tier === 1 ? 'strategic' : tier === 2 ? 'tactical' : 'operational',
        evmCalculated: evmResult.hasEVM,
        frameworks: [], // Could be populated based on what was used
      },
    });

  } catch (error) {
    console.error('[ConstructionAgent] Error:', error);
    return NextResponse.json(
      { error: 'Agent processing failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
