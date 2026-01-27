import { z } from 'zod';
import { tool } from 'ai';
import { CashFlowProjection, ToolResponse } from '../types';

// Simulated project management API (replace with Procore, Buildertrend, etc.)
const mockProjectAPI = {
  async getFinancialData(projectId: string) {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return {
      totalBudget: 1000000,
      spentToDate: 450000,
      milestones: [
        { name: 'Foundation Complete', date: '2024-03-01', payment: 200000 },
        { name: 'Framing Complete', date: '2024-05-15', payment: 300000 },
        { name: 'Final Completion', date: '2024-08-30', payment: 500000 }
      ],
      monthlyCosts: [
        { month: '2024-01', cost: 75000 },
        { month: '2024-02', cost: 80000 },
        { month: '2024-03', cost: 120000 },
        { month: '2024-04', cost: 95000 },
        { month: '2024-05', cost: 80000 }
      ]
    };
  }
};

const financeAnalyzerSchema = z.object({
  projectId: z.string().describe('Project ID to analyze'),
  forecastMonths: z.number().min(1).max(24).default(6).describe('Months to forecast')
});

export const financeAnalyzerTool = tool({
  description: 'Analyzes project financial data and estimates future cash flow',
  inputSchema: financeAnalyzerSchema,
  execute: async ({ projectId, forecastMonths }) => {
    try {
      const months = forecastMonths || 6;
      const data = await mockProjectAPI.getFinancialData(projectId);
      
      // Calculate average monthly costs
      const avgMonthlyCost = data.monthlyCosts.reduce((sum, m) => sum + m.cost, 0) / data.monthlyCosts.length;
      
      // Generate projection
      const projection: CashFlowProjection['monthly'] = [];
      let currentDate = new Date();
      
      for (let i = 0; i < months; i++) {
        const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
        const monthKey = monthDate.toISOString().slice(0, 7);
        
        // Find milestone payments for this month
        const milestonePayments = data.milestones
          .filter(m => m.date.startsWith(monthKey))
          .reduce((sum, m) => sum + m.payment, 0);
        
        const monthlyCost = avgMonthlyCost * (0.9 + Math.random() * 0.2); // Add variance
        const net = milestonePayments - monthlyCost;
        
        projection.push({
          month: monthKey,
          income: milestonePayments,
          expenses: monthlyCost,
          net
        });
      }
      
      const totalProjected = projection.reduce((sum, m) => sum + m.net, 0);
      
      return {
        success: true,
        data: { monthly: projection, totalProjected }
      };
    } catch (error) {
      return {
        success: false,
        error: `Financial analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
});
