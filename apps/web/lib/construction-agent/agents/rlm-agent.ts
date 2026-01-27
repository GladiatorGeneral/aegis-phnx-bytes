import { generateText, tool } from 'ai';
import { z } from 'zod';
import { openai } from '@ai-sdk/openai'; // Using OpenAI as default, can be swapped for DeepSeek
import { rlmSystemPrompt } from '../prompts/rlm-controller';

// Import existing tools
import { changeOrderLoggerTool } from '../tools/change-order-logger';
import { documentProcessorTool } from '../tools/document-processor';
import { financeAnalyzerTool } from '../tools/finance-analyzer';
import { regulationMonitorTool } from '../tools/regulation-monitor';
import { profitSimulationTool } from '../tools/profit-simulation';

// Define the tools object for the agent
const agentTools = {
  changeOrderLogger: changeOrderLoggerTool,
  documentProcessor: documentProcessorTool,
  financeAnalyzer: financeAnalyzerTool,
  regulationMonitor: regulationMonitorTool,
  profitSimulation: profitSimulationTool,
};

export async function analyzeContractWithRLM(documentText: string, userQuery: string) {
  // This simulates the RLM's "REPL environment" by providing the document as a referenced variable.
  const fullPrompt = `
  [DOCUMENT_START]
  ${documentText}
  [DOCUMENT_END]

  USER QUERY: ${userQuery}

  INSTRUCTIONS: You are the RLM Controller. The full document is loaded in your environment above. Follow your principles.
  `;

  const { text: finalAnalysis } = await generateText({
    model: openai('gpt-4o'),
    system: rlmSystemPrompt,
    prompt: fullPrompt,
    tools: agentTools,
  });

  return finalAnalysis;
}

// Expose the RLM Agent itself as a Tool so it can be called by the MCP Server
// This allows the desktop user to say "Run a deep analysis on this text"
const rlmAnalysisSchema = z.object({
  documentText: z.string().describe('The full text content of the document to analyze'),
  query: z.string().describe('The specific question or analysis goal (e.g., "Find all liability clauses")'),
});

export const rlmAnalysisTool = tool({
  description: 'Performs a deep, recursive analysis of a long construction document or contract using the RLM pattern.',
  inputSchema: rlmAnalysisSchema,
  execute: async ({ documentText, query }) => {
    try {
      const result = await analyzeContractWithRLM(documentText, query);
      return {
        success: true,
        analysis: result
      };
    } catch (error) {
       return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error during RLM analysis'
      };
    }
  }
});
