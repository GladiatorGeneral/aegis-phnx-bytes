// lib/phnxaura/orchestrator/index.ts
import { VM } from 'vm2';
import { VectorStore } from '../rag/vector-store';
import { DeepSeekClient } from '../mcp/deepseek-client';
import { HuggingFaceClient } from '../mcp/hf-client';
import { RetrievalContext } from '@/types/phnxaura';
import { ArchitectAgent, CoderAgent, ReviewerAgent, SecurityAgent, BaseAgent, AgentResult } from './agents';

export interface OrchestrationConfig {
    prompt: string;
    agents: string[];
    retrievedContext: RetrievalContext[];
    modelConfig: {
        primary: string;
        temperature: number;
    };
    namespace: string;
    auditMetadata?: any;
}

export interface OrchestrationResult {
    code: string;
    consensus: boolean;
    agentsUsed: string[];
    contextSources: string[];
}

export class AgentOrchestrator {
  private vectorStore: VectorStore;
  private deepseek: DeepSeekClient;
  private hf: HuggingFaceClient;
  private sandbox: VM;

  constructor() {
    this.vectorStore = new VectorStore();
    this.deepseek = new DeepSeekClient();
    this.hf = new HuggingFaceClient();
    
    // Secure sandbox for code execution
    this.sandbox = new VM({
      timeout: 5000,
      sandbox: {
        console: {
          log: (...args: any[]) => console.log('[Agent Sandbox]', ...args)
        }
      },
      require: {
        external: false,
        builtin: ['fs', 'path']
      }
    });
  }

  async execute(config: OrchestrationConfig): Promise<OrchestrationResult> {
    const { prompt, agents, retrievedContext, modelConfig } = config;
    
    // Build system prompt with RAG context
    const systemPrompt = this.buildSystemPrompt(retrievedContext);
    
    // Multi-agent workflow
    const results: AgentResult[] = [];
    
    for (const agentType of agents) {
      const agent = this.createAgent(agentType);
      const context = await this.prepareAgentContext(agentType, retrievedContext);
      
      const result = await agent.execute({
        prompt,
        systemPrompt,
        context,
        model: modelConfig.primary,
        temperature: modelConfig.temperature
      });
      
      results.push(result);
      
      // Store agent output in vector DB for future retrieval
      await this.storeAgentOutput(result, config.namespace);
    }

    // Consensus validation
    const consensus = await this.validateConsensus(results);
    
    return {
      code: this.mergeResults(results),
      consensus,
      agentsUsed: agents,
      contextSources: retrievedContext.map(c => c.source)
    };
  }

  private buildSystemPrompt(context: RetrievalContext[]): string {
    return `You are PHNXAURA, an AI coding orchestrator. 
Available context from knowledge base:
${context.map(c => `- ${c.source}: ${c.content.slice(0, 200)}...`).join('\n')}

Guidelines:
1. Use retrieved patterns when applicable
2. Follow security best practices from context
3. Generate TypeScript with strict typing
4. Include error handling and logging`;
  }

  private createAgent(type: string): BaseAgent {
    const agents: Record<string, BaseAgent> = {
      architect: new ArchitectAgent(this.deepseek),
      coder: new CoderAgent(this.deepseek, this.sandbox),
      reviewer: new ReviewerAgent(this.hf),
      security: new SecurityAgent(this.hf)
    };
    return agents[type];
  }

  private async prepareAgentContext(agentType: string, context: RetrievalContext[]) {
      // Just return context for now, could filter based on agent type
      return context;
  }

  private async validateConsensus(results: AgentResult[]) {
      return true; // Simplified
  }

  private mergeResults(results: AgentResult[]) {
      return results.map(r => r.output).join('\n\n');
  }

  private async storeAgentOutput(result: AgentResult, namespace: string) {
    if (result.output) {
        await this.vectorStore.embedAndStore([{
        content: result.output,
        source: `agent:${result.agentType}:${result.timestamp}`,
        type: 'conversation',
        metadata: { agentType: result.agentType, quality: result.qualityScore }
        }], namespace);
    }
  }
}
