// Run with: npx tsx apps/web/scripts/seed-knowledge.ts

import * as dotenv from 'dotenv';
import { Pinecone } from '@pinecone-database/pinecone';
import { openai } from '@ai-sdk/openai';
import { embedMany } from 'ai';

// Load env from .env.local if possible, or assume process.env is set
dotenv.config({ path: 'apps/web/.env.local' });

const FALLBACK_DATA = [
  {
    code: 'IBC 2021 - 1507.2.1',
    text: 'Roof drainage systems must be designed for rainfall intensity of 6 inches per hour to prevent structural overload.'
  },
  {
    code: 'ICC 400-2018',
    text: 'Mass timber buildings shall not exceed 18 stories in height. Fire resistance ratings must align with Type IV construction.'
  },
  {
    code: 'LEED v4.1 MR',
    text: 'Construction waste management: minimum 75% diversion from landfill required for default Materials & Resources credit.'
  },
  {
    code: 'OSHA 1926.501(b)(1)',
    text: 'Each employee on a walking/working surface (horizontal and vertical surface) with an unprotected side or edge which is 6 feet (1.8 m) or more above a lower level shall be protected from falling by the use of guardrail systems, safety net systems, or personal fall arrest systems.'
  },
  {
    code: 'NEC 2023 - 210.8',
    text: 'All 125-volt through 250-volt receptacles supplied by single-phase branch circuits rated 150 volts or less to ground shall have ground-fault circuit-interrupter protection for personnel.'
  }
];

async function seed() {
  const apiKey = process.env.PINECONE_API_KEY;
  const indexName = process.env.PINECONE_INDEX || 'construction-knowledge';

  if (!apiKey) {
    console.error('❌ PINECONE_API_KEY not found in environment variables.');
    process.exit(1);
  }

  console.log('🌱 Initializing Pinecone...');
  const pinecone = new Pinecone({ apiKey });
  const index = pinecone.index(indexName);

  console.log('📚 Generating embeddings for knowledge base...');
  
  const values = FALLBACK_DATA.map(d => `${d.code}: ${d.text}`);
  
  try {
    const { embeddings } = await embedMany({
      model: openai.embedding('text-embedding-3-small'),
      values: values,
    });

    console.log(`✨ Generated ${embeddings.length} vectors.`);

    const records = embeddings.map((embedding, i) => ({
      id: `rule-${i}`,
      values: embedding,
      metadata: {
        code: FALLBACK_DATA[i].code,
        text: FALLBACK_DATA[i].text,
        source: 'regulatory-seed'
      }
    }));

    console.log('🚀 Upserting into Pinecone...');
    await index.upsert(records);

    console.log('✅ Knowledge base successfully seeded!');
    
  } catch (error) {
    console.error('❌ Error seeding knowledge base:', error);
  }
}

seed();
