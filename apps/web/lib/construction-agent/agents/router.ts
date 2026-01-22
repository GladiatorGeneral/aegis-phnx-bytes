import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { CostForecastingAgent } from './cost-forecaster';
// Import other agents as they are built...

export class AgentRouter {
  private costAgent = new CostForecastingAgent();
  
  public async routeAndExecute(query: string, context: any) {
    // 1. Classify Intent
    const { object } = await generateObject({
      model: openai('gpt-4o'),
      schema: z.object({
        intent: z.enum(['cost_analysis', 'schedule_analysis', 'compliance_check', 'general_chat']),
        confidence: z.number(),
        reasoning: z.string()
      }),
      prompt: `Classify this construction user query: "${query}"`
    });

    console.log(`[Router] Routing to ${object.intent} (Confidence: ${object.confidence})`);

    // 2. Route to specific agent
    switch (object.intent) {
      case 'cost_analysis':
        return this.costAgent.execute(query, context);
      
      case 'schedule_analysis':
        // return this.scheduleAgent.execute(query, context);
        return { answer: "Schedule Agent is under construction (Phase 2).", confidence: 1 };

      case 'compliance_check':
        // Logic currently in your existing monolithic tool route, 
        // eventually moved to a ComplianceAgent class.
        return { answer: "Please use the specialized Compliance Tool for now.", confidence: 1 };

      default:
        // General chat fallback
        return { answer: "I can help with Cost, Schedule, or Compliance. Please be more specific.", confidence: 1 };
    }
  }
}
