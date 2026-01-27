import { generateText, tool } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

// Define the analysis result schema
export interface ChangeOrderAnalysis {
  justification: string;
  costAssessment: string;
  scheduleImpact: string;
  riskFlags: string[];
  recommendation: 'approve' | 'deny' | 'request_info';
  confidence: number;
}

// Tool for analyzing change order cost reasonableness
const costBenchmarkingTool = tool({
  description: 'Benchmark change order costs against historical project data',
  inputSchema: z.object({
    description: z.string(),
    claimedCost: z.number(),
    projectPhase: z.string().optional(),
  }),
  execute: async ({ description, claimedCost, projectPhase }) => {
    // Mock historical benchmarking (replace with actual database query)
    const avgCostPerSqFt = 150;
    const estimatedReasonableCost = claimedCost * 0.85;
    
    return {
      historicalAverage: estimatedReasonableCost,
      variance: ((claimedCost - estimatedReasonableCost) / estimatedReasonableCost) * 100,
      isReasonable: Math.abs(claimedCost - estimatedReasonableCost) / estimatedReasonableCost < 0.2,
    };
  },
});

// Tool for schedule impact analysis
const scheduleImpactTool = tool({
  description: 'Analyze the impact on project critical path and schedule',
  inputSchema: z.object({
    claimedDays: z.number(),
    description: z.string(),
  }),
  execute: async ({ claimedDays, description }) => {
    // Mock critical path analysis
    const isCriticalPath = description.toLowerCase().includes('foundation') || 
                          description.toLowerCase().includes('structural');
    
    return {
      onCriticalPath: isCriticalPath,
      totalProjectDelay: isCriticalPath ? claimedDays : Math.ceil(claimedDays * 0.5),
      mitigationOptions: isCriticalPath 
        ? ['Add second shift', 'Parallel activities', 'Fast-track permitting']
        : ['Adjust non-critical activities', 'Resource reallocation'],
    };
  },
});

/**
 * Tier 2: Tactical Change Order Analysis Agent
 * 
 * This agent analyzes construction change orders for:
 * - Justification validity
 * - Cost reasonableness
 * - Schedule impact
 * - Risk identification
 */
export async function tacticalChangeOrderAgent(
  changeDescription: string,
  claimedCost: number,
  claimedTimeDays: number,
  projectContext?: string
): Promise<ChangeOrderAnalysis> {
  // Construct detailed prompt for the LLM
  const prompt = `
As a Tier 2 Tactical Construction AI Agent, analyze this change order.

PROJECT CONTEXT: ${projectContext || 'General commercial construction project'}

CHANGE ORDER DETAILS:
- Description: ${changeDescription}
- Claimed Cost: $${claimedCost.toLocaleString()}
- Claimed Time Impact: ${claimedTimeDays} days

Provide a comprehensive analysis covering:
1. **Justification Assessment**: Is the cause (design error, unforeseen conditions, owner request) valid and well-documented?
2. **Cost Reasonableness**: Are the claimed costs justified based on scope and market rates?
3. **Schedule Impact**: How does this affect the critical path and overall timeline?
4. **Risk Identification**: What contractual, financial, or execution risks exist?
5. **Recommendation**: Should this be approved, denied, or does it require more information?

Respond in JSON format with the following structure:
{
  "justification": "detailed assessment of validity",
  "costAssessment": "analysis of cost reasonableness",
  "scheduleImpact": "impact on project timeline",
  "riskFlags": ["risk1", "risk2"],
  "recommendation": "approve|deny|request_info",
  "confidence": 0.85
}
`;

  // Execute the LLM with tool-calling capability
  const { text } = await generateText({
    model: openai('gpt-4o'),
    system: `You are a seasoned construction project manager with 20+ years of experience analyzing change orders. 
You provide detailed, evidence-based analysis and clear recommendations. You are skeptical but fair, 
always looking out for the owner's best interests while maintaining good contractor relationships.`,
    prompt,
    tools: {
      costBenchmarking: costBenchmarkingTool,
      scheduleImpact: scheduleImpactTool,
    },
  });

  // Parse the LLM response
  try {
    // Try to extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    // Fallback if JSON parsing fails
    return {
      justification: text.substring(0, 200),
      costAssessment: 'Analysis completed. Review full details.',
      scheduleImpact: `${claimedTimeDays} day impact claimed`,
      riskFlags: [],
      recommendation: 'request_info',
      confidence: 0.5,
    };
  } catch (error) {
    throw new Error(`Failed to parse agent response: ${error}`);
  }
}
