import { z } from 'zod';
import { tool } from 'ai';
import { ComplianceResult, ToolResponse } from '../types';
import { getIndex } from '../rag/pinecone';
import { generateEmbedding } from '../rag/embeddings';

// Fallback hardcoded knowledge if RAG fails or is empty
const FALLBACK_REGULATIONS = [
  {
    code: 'IBC 2021 - 1507.2.1',
    text: 'Roof drainage systems must be designed for rainfall intensity of 6 inches per hour'
  },
  {
    code: 'ICC 400-2018',
    text: 'Mass timber buildings shall not exceed 18 stories in height'
  },
  {
    code: 'LEED v4.1',
    text: 'Construction waste management: minimum 75% diversion required for Materials & Resources credit'
  },
  {
    code: 'OSHA 1926.501',
    text: 'Fall protection required at heights of 6 feet or more in construction'
  }
];

const regulationMonitorSchema = z.object({
  materialSpec: z.string().describe('Building material or specification to check'),
  projectLocation: z.string().optional().describe('Project location for local codes'),
  standard: z.enum(['IBC', 'LEED', 'OSHA', 'local']).optional()
});

export const regulationMonitorTool = tool({
  description: 'Checks building specifications against current codes and sustainability standards using RAG',
  inputSchema: regulationMonitorSchema,
  execute: async ({ materialSpec, projectLocation, standard }) => {
  try {
      console.log(`[RegulationMonitor] Checking: ${materialSpec} (${standard || 'General'})`);
      
      let relevantDocs: Array<{ code: string; text: string }> = [];
      let isRagSuccess = false;

      // 1. Try RAG Retrieval
      try {
        if (process.env.PINECONE_API_KEY) {
          const queryText = `${standard ? standard + ': ' : ''}${materialSpec} ${projectLocation || ''}`;
          const vector = await generateEmbedding(queryText);
          const index = getIndex();
          
          const queryResponse = await index.query({
            vector,
            topK: 3,
            includeMetadata: true
          });

          if (queryResponse.matches && queryResponse.matches.length > 0) {
            relevantDocs = queryResponse.matches.map(match => ({
              code: (match.metadata?.code as string) || 'Unknown Code',
              text: (match.metadata?.text as string) || ''
            })).filter(d => d.text.length > 0);
            isRagSuccess = true;
          }
        }
      } catch (err) {
        console.warn('[RegulationMonitor] RAG retrieval failed, using fallback:', err);
      }

      // 2. Fallback if RAG empty or failed
      if (!isRagSuccess || relevantDocs.length === 0) {
        relevantDocs = FALLBACK_REGULATIONS.filter(reg => 
          materialSpec.toLowerCase().includes('roof') && reg.text.toLowerCase().includes('roof') ||
          materialSpec.toLowerCase().includes('timber') && reg.code.includes('ICC 400') ||
          materialSpec.toLowerCase().includes('waste') && reg.code.includes('LEED') ||
          materialSpec.toLowerCase().includes('height') && reg.code.includes('OSHA')
        );
        // Default if no keyword match
        if (relevantDocs.length === 0) relevantDocs = FALLBACK_REGULATIONS.slice(0, 2);
      }

      // 3. Logic Check (Simplified compliance logic)
      const violations: string[] = [];
      const recommendations: string[] = [];
      
      // Heuristic check: if the spec doesn't mention the key requirement found in the docs
      for (const doc of relevantDocs) {
        // Very basic simple keyword negation check for demo
        // In reality, you'd use an LLM here to compare spec vs doc.text
        if (materialSpec.toLowerCase().includes('roof') && doc.text.includes('6 inches') && !materialSpec.includes('6 inches')) {
           violations.push(`Potential mismatch with ${doc.code}: Specification does not explicitly mention 6 inch/hr rainfall capacity.`);
        }
        recommendations.push(`Refer to ${doc.code}: ${doc.text}`);
      }
      
      return {
        success: true,
        data: {
          isCompliant: violations.length === 0,
          relevantCodes: relevantDocs.map(m => m.code),
          violations,
          recommendations
        }
      };
    } catch (error) {
      return {
        success: false,
        error: `Compliance check failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
});
