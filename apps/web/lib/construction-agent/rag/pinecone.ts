import { Pinecone } from '@pinecone-database/pinecone';

if (!process.env.PINECONE_API_KEY) {
  console.warn('PINECONE_API_KEY is not set. RAG features will fail.');
}

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY || '',
});

// The index name should be defined in valid environment variables or default
export const INDEX_NAME = process.env.PINECONE_INDEX || 'construction-knowledge';

export const getIndex = () => {
  return pinecone.index(INDEX_NAME);
};

export { pinecone };
