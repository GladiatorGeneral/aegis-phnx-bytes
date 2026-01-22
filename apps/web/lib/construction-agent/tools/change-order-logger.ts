import { z } from 'zod';
import { tool } from 'ai';
import { ChangeOrder, ToolResponse } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Simulated project database (replace with actual DB like Supabase, Prisma)
const mockProjectDB = {
  async createChangeOrder(data: Omit<ChangeOrder, 'id' | 'createdAt'>): Promise<ChangeOrder> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const changeOrder: ChangeOrder = {
      id: uuidv4(),
      createdAt: new Date(),
      ...data
    };
    
    console.log('[ChangeOrderLogger] Created:', changeOrder);
    return changeOrder;
  }
};

export const changeOrderLoggerTool = tool({
  description: 'Parses client messages and automatically creates structured change order tickets',
  parameters: z.object({
    clientMessage: z.string().describe('Raw email or chat message from client'),
    projectId: z.string().describe('Target project ID'),
    priority: z.enum(['low', 'medium', 'high']).optional()
  }),
  execute: async ({ clientMessage, projectId, priority }): Promise<ToolResponse<ChangeOrder>> => {
    try {
      // Simple NLP extraction (replace with more sophisticated parsing)
      const costMatch = clientMessage.match(/\$(\d+[,\d]*(?:\.\d{2})?)/);
      const estimatedCost = costMatch ? parseFloat(costMatch[1].replace(',', '')) : 0;
      
      // Determine priority from keywords if not provided
      let finalPriority: 'low' | 'medium' | 'high' = priority || 'medium';
      if (!priority) {
        if (clientMessage.toLowerCase().includes('urgent') || clientMessage.toLowerCase().includes('asap')) {
          finalPriority = 'high';
        } else if (clientMessage.toLowerCase().includes('when possible')) {
          finalPriority = 'low';
        }
      }
      
      const changeOrder = await mockProjectDB.createChangeOrder({
        projectId,
        description: clientMessage.substring(0, 200) + (clientMessage.length > 200 ? '...' : ''),
        estimatedCost,
        priority: finalPriority
      });
      
      return { success: true, data: changeOrder };
    } catch (error) {
      return {
        success: false,
        error: `Failed to create change order: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  },
});
