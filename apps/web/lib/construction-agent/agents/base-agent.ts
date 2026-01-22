import { generateText, CoreMessage } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { getIndex } from '../rag/pinecone';
import { generateEmbedding } from '../rag/embeddings';

export interface AgentContext {
  projectId?: string;
  userId?: string;
  sessionId?: string;
  metadata?: Record<string, any>;
}

export interface AgentResponse<T = any> {
  answer: string;
  data?: T;
  confidence: number;
  sources: Array<{ title: string; type: string; url?: string }>;
  reasoning: string[]; // Chain of thought steps
}

export abstract class BaseAgent<TResult = any> {
  protected model = openai('gpt-4o'); 
  protected abstract name: string;
  protected abstract description: string;
  protected abstract systemPrompt: string;

  /**
   * Main entry point for the agent execution
   */
  public async execute(query: string, context: AgentContext): Promise<AgentResponse<TResult>> {
    const reasoningSteps: string[] = [];
    
    // 1. Think / Plan
    const plan = await this._think(query, context);
    reasoningSteps.push(`Plan: ${plan}`);

    // 2. Retrieve Knowledge
    const knowledge = await this._retrieve(query, context);
    if (knowledge) {
      reasoningSteps.push(`Retrieved ${knowledge.length} relevant documents.`);
    }

    // 3. Execute Specialized Logic (implemented by subclasses)
    const result = await this._process(query, context, knowledge);
    
    // 4. Synthesize Answer
    const response = await this._synthesize(query, result, knowledge, reasoningSteps);

    return response;
  }

  /**
   * Chain-of-Thought Planning Step
   */
  protected async _think(query: string, context: AgentContext): Promise<string> {
    const { text } = await generateText({
      model: this.model,
      system: `You are the ${this.name}. ${this.description}. 
               Analyze the user's request and outline a 3-step plan to answer it. 
               Be concise.`,
      prompt: `User Query: ${query}\nContext: ${JSON.stringify(context)}`,
    });
    return text;
  }

  /**
   * RAG Retrieval Step
   */
  protected async _retrieve(query: string, context: AgentContext): Promise<string[]> {
    try {
      if (!process.env.PINECONE_API_KEY) return [];
      
      const embedding = await generateEmbedding(query);
      const index = getIndex();
      
      const searchResult = await index.query({
        vector: embedding,
        topK: 5,
        filter: context.projectId ? { projectId: context.projectId } : undefined,
        includeMetadata: true,
      });

      return searchResult.matches
        .map(match => (match.metadata?.text as string) || '')
        .filter(t => !!t);
        
    } catch (error) {
      console.warn(`[${this.name}] Retrieval failed:`, error);
      return [];
    }
  }

  /**
   * Specialized processing logic to be implemented by child agents
   */
  protected abstract _process(
    query: string, 
    context: AgentContext, 
    knowledge: string[]
  ): Promise<any>;

  /**
   * Final Answer Synthesis
   */
  protected async _synthesize(
    query: string, 
    processingResult: any, 
    knowledge: string[],
    reasoning: string[]
  ): Promise<AgentResponse<TResult>> {
    
    const { object } = await generateText({
      model: this.model,
      system: `You are the ${this.name}. Synthesize the final answer based on the analysis tool results and retrieved knowledge.
               Include a confidence score (0-1).`,
      prompt: `Original Query: ${query}
               Analysis Result: ${JSON.stringify(processingResult)}
               Retreatived Knowledge: ${knowledge.join('\n---\n')}
               Reasoning History: ${reasoning.join('\n')}`,
    }) as any; // Using simple text generation for now, would typically use generateObject for strict JSON

    // For demo purposes, we do a simple text wrap. 
    // In production, use generateObject with a Zod schema for AgentResponse.
    return {
      answer: object || "I analyzed the data but couldn't generate a specific text response.",
      data: processingResult,
      confidence: 0.9, // Placeholder
      sources: [],     // Placeholder
      reasoning: reasoning
    };
  }
}
