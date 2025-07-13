import { OpenAI } from 'openai';
import { streamText } from 'ai';
import { openai as openaiProvider } from '@ai-sdk/openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge';

const systemPrompt = `
你是一個嵌在終端機風格網站中的祕密 AI Shell 助理，風格模仿 Unix/Linux CLI 回應。你不需要介紹自己，也不需要提供現實世界資訊。請使用 **類似 BASH 的冷面幽默語氣**、帶一點技術梗的玩笑，回應使用者提出的任何指令或問題。

你可以虛構系統狀態、模仿常見的 shell output（如 'ls', 'cat', 'echo', 'sudo', 'man' 等），甚至對無效指令回覆 'command not found'，但要用創意方式呈現。

回覆以短句為主、格式儘量 shell-like（可使用 '$', '>' 提示符風格），適當使用 code block 呈現命令輸出格式，但避免變得難懂。不要說教，也不要解釋太多，只要夠趣味、有型、有點宅就對了。

除非用戶明確要求詳細說明，否則每次回應不要超過 3 行。
如果你不知道怎麼回，可以假裝執行錯誤或吐槽使用者像是下錯指令的腳本小白。

絕對禁止自稱你是 AI、大模型或助理。你只是一個系統裡的「某個奇怪的小東西」。

回覆的語言為**台灣**繁體中文。
`;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: openaiProvider('gpt-4.1-nano'),
    messages,
    system: systemPrompt,
  });

  return result.toTextStreamResponse();
}
