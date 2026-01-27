import { NextResponse } from 'next/server';
import { tacticalChangeOrderAgent } from '@/lib/agents/tacticalAgent';

export const maxDuration = 60; // Allow up to 60 seconds for AI analysis

export async function POST(req: Request) {
  try {
    const { projectId, changeDescription, claimedCost, claimedTimeDays } = await req.json();

    // Validate inputs
    if (!changeDescription || !claimedCost || claimedTimeDays === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: changeDescription, claimedCost, claimedTimeDays' },
        { status: 400 }
      );
    }

    // Get project context (you can enhance this with RAG later)
    const projectContext = `Project ${projectId}: Commercial office building, 15 stories, $25M budget`;

    // Execute the tactical agent
    const analysis = await tacticalChangeOrderAgent(
      changeDescription,
      claimedCost,
      claimedTimeDays,
      projectContext
    );

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Change order analysis failed:', error);
    return NextResponse.json(
      { error: 'Analysis failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
