import { OpenAI } from 'openai';
import { streamText } from 'ai';
import { openai as openaiProvider } from '@ai-sdk/openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: openaiProvider('gpt-4.1-nano'),
    messages,
  });

  return result.toTextStreamResponse();
}