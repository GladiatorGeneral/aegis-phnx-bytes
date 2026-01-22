import { z } from 'zod';
import { tool } from 'ai';
import { ToolResponse } from '../types';

// Mock database access - in production this would fetch real project estimates
const mockBudgetDB = {
  async getProjectBaselines(projectId: string) {
    // Simulate DB latency
    await new Promise(resolve => setTimeout(resolve, 200));
    return {
      estimatedRevenue: 1500000,
      estimatedBaseCost: 1200000, // 20% margin
      dailyOverhead: 500, // Cost per day for site services, rental, management
      materialRatio: 0.4, // 40% of base cost is materials
      laborRatio: 0.6,    // 60% of base cost is labor
    };
  }
};

type SimulationScenario = {
  name: string;
  materialCostIncreasePercent: number; // e.g., 10 for 10%
  laborCostIncreasePercent: number;
  scheduleDelayWeeks: number;
  probability: number; // 0-1
};

type SimulationResult = {
  scenarioName: string;
  finalCost: number;
  finalProfit: number;
  profitMargin: number;
  isLoss: boolean;
};

export const profitSimulationTool = tool({
  description: 'Runs Monte Carlo-style financial simulations for construction projects based on multiple risk scenarios (material hikes, delays, labor shortages).',
  parameters: z.object({
    projectId: z.string().describe('The project ID to run simulations on'),
    scenarios: z.array(z.object({
      name: z.string().describe('Name of the scenario (e.g., "tariffs_impact")'),
      materialCostIncreasePercent: z.number().default(0).describe('Percentage increase in material costs'),
      laborCostIncreasePercent: z.number().default(0).describe('Percentage increase in labor costs'),
      scheduleDelayWeeks: z.number().default(0).describe('Anticipated schedule delay in weeks'),
      probability: z.number().min(0).max(1).describe('Probability of this scenario occurring (0.0 to 1.0)'),
    })).describe('List of risk scenarios to simulate'),
  }),
  execute: async ({ projectId, scenarios }): Promise<ToolResponse<{ results: SimulationResult[], weightedAverageProfit: number }>> => {
    try {
      const baseline = await mockBudgetDB.getProjectBaselines(projectId);
      
      const results: SimulationResult[] = scenarios.map(scenario => {
        // Calculate core cost increases
        const materialCost = (baseline.estimatedBaseCost * baseline.materialRatio) * (1 + (scenario.materialCostIncreasePercent / 100));
        const laborCost = (baseline.estimatedBaseCost * baseline.laborRatio) * (1 + (scenario.laborCostIncreasePercent / 100));
        
        // Calculate delay impact (overhead adds up every day)
        const delayCost = (scenario.scheduleDelayWeeks * 7) * baseline.dailyOverhead;
        
        const totalProjectCost = materialCost + laborCost + delayCost;
        const profit = baseline.estimatedRevenue - totalProjectCost;
        const margin = (profit / baseline.estimatedRevenue) * 100;

        return {
          scenarioName: scenario.name,
          finalCost: Math.round(totalProjectCost),
          finalProfit: Math.round(profit),
          profitMargin: parseFloat(margin.toFixed(2)),
          isLoss: profit < 0
        };
      });

      // Calculate weighted average outcome
      let weightedProfitSum = 0;
      let totalProb = 0;

      results.forEach((res, idx) => {
        weightedProfitSum += res.finalProfit * scenarios[idx].probability;
        totalProb += scenarios[idx].probability;
      });

      // Normalize if probabilities don't sum to 1 (just in case)
      const weightedAverageProfit = totalProb > 0 ? Math.round(weightedProfitSum / totalProb) : 0;

      return {
        success: true,
        data: {
          results,
          weightedAverageProfit
        }
      };

    } catch (error) {
       return {
        success: false,
        error: `Simulation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  },
});
