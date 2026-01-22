import { deepseek } from '@ai-sdk/deepseek';
import { streamText } from 'ai';

export const maxDuration = 30;

const SYSTEM =
  "You are the phnxbyte assistant. Help the user turn an API description or OpenAPI snippet into a practical TypeScript client. Prefer concise answers. When generating code, use fenced code blocks with a language tag (typescript). Include: types, a minimal fetch client, and optional React hooks. If you need clarification, ask one focused question.";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: deepseek('deepseek-chat'),
    messages: [{ role: 'system', content: SYSTEM }, ...messages],
  });

  return result.toTextStreamResponse();
}
