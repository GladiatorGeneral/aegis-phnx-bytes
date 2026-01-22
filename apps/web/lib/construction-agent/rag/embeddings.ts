import { openai } from '@ai-sdk/openai';
import { embed, embedMany } from 'ai';

export const generateEmbedding = async (value: string) => {
  const input = value.replace(/\n/g, ' ');
  const { embedding } = await embed({
    model: openai.embedding('text-embedding-3-small'),
    value: input,
  });
  return embedding;
};

export const generateEmbeddings = async (values: string[]) => {
  const { embeddings } = await embedMany({
    model: openai.embedding('text-embedding-3-small'),
    values: values.map(v => v.replace(/\n/g, ' ')),
  });
  return embeddings;
};
