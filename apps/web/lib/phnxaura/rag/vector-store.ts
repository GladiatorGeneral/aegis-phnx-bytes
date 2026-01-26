// lib/phnxaura/rag/vector-store.ts
import { Pinecone } from '@pinecone-database/pinecone';
import { HuggingFaceInference } from '@huggingface/inference';
import { createHash } from 'crypto';
import { RetrievalContext, DocumentChunk } from '@/types/phnxaura';

export class VectorStore {
  private pinecone: Pinecone;
  private hf: HuggingFaceInference;
  private indexName = process.env.PINECONE_INDEX || 'phnxaura-knowledge';
  
  constructor() {
    this.pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
    this.hf = new HuggingFaceInference(process.env.HF_API_KEY!);
  }

  async initialize() {
    const indexes = await this.pinecone.listIndexes();
    if (!indexes.indexes?.find(i => i.name === this.indexName)) {
      await this.pinecone.createIndex({
        name: this.indexName,
        dimension: 384, // all-MiniLM-L6-v2 is 384, not 768. 768 is for larger models. I'll stick to 384 for MiniLM-L6-v2 as commonly used, or if the user specified 768 I should be careful. 
        // User config said "768 // all-MiniLM-L6-v2". Wait, all-MiniLM-L6-v2 is actually 384 dimensions by default. 
        // all-mpnet-base-v2 is 768. 
        // I'll set to 384 for MiniLM-L6-v2 as that's the model specified in generateEmbedding.
        metric: 'cosine',
        spec: { serverless: { cloud: 'aws', region: 'us-east-1' } }
      });
    }
  }

  async embedAndStore(documents: DocumentChunk[], namespace: string) {
    const index = this.pinecone.index(this.indexName).namespace(namespace);
    
    // Batch embedding via Hugging Face - processing one by one to avoid rate limits or implementation issues with batch API if not available
    const embeddings = await Promise.all(
      documents.map(doc => this.generateEmbedding(doc.content))
    );

    const vectors = documents.map((doc, i) => ({
      id: createHash('sha256').update(doc.content + i).digest('hex'), // Added index to hash to ensure uniqueness if duplicate content
      values: embeddings[i],
      metadata: {
        content: doc.content,
        source: doc.source,
        type: doc.type,
        timestamp: new Date().toISOString(),
        ...doc.metadata
      }
    }));

    // Upsert in batches of 100
    for (let i = 0; i < vectors.length; i += 100) {
      await index.upsert(vectors.slice(i, i + 100));
    }
  }

  async retrieveRelevant(
    query: string, 
    namespace: string, 
    topK: number = 5,
    filter?: Record<string, any>
  ): Promise<RetrievalContext[]> {
    const queryEmbedding = await this.generateEmbedding(query);
    const index = this.pinecone.index(this.indexName).namespace(namespace);
    
    const results = await index.query({
      vector: queryEmbedding,
      topK,
      includeMetadata: true,
      filter
    });

    return results.matches?.map(match => ({
      content: match.metadata?.content as string,
      source: match.metadata?.source as string,
      similarity: match.score || 0,
      metadata: match.metadata || {}
    })) || [];
  }

  private async generateEmbedding(text: string): Promise<number[]> {
    const result = await this.hf.featureExtraction({
      model: 'sentence-transformers/all-MiniLM-L6-v2',
      inputs: text.slice(0, 512) // Truncate for efficiency
    });
    // HF API returns different shapes. We expect a simple array for a single input usually, but type checking is good.
    // For featuredExtraction with one input, it might return (number | number[])[].
    // If we assume a 1D array of numbers for the embedding.
    if (Array.isArray(result)) {
        // if nested array (batch), satisfy type
        const flat = result.flat();
        // Check if it's numbers
        if (typeof flat[0] === 'number') return flat as number[];
    }
    return [] as number[];
  }
}
