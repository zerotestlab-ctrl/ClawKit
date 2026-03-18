import OpenAI from "openai";

let _client: OpenAI | null = null;

function ai(): OpenAI {
  if (!_client) {
    const useGrok = process.env.XAI_API_KEY && !process.env.OPENAI_API_KEY;
    _client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || process.env.XAI_API_KEY || "",
      baseURL: useGrok ? "https://api.x.ai/v1" : undefined,
    });
  }
  return _client;
}

export interface GenerateChaseParams {
  clientName: string;
  amount: number;
  dueDate: string;
  daysOverdue: number;
  vibeTone: string;
  paymentLink: string;
  previousFeedback?: { step: number; feedback: string }[];
  clientNotes?: string;
}

export async function generateChaseSequence(
  params: GenerateChaseParams,
): Promise<{ step1: string; step2: string; step3: string }> {
  const feedbackBlock = params.previousFeedback?.length
    ? `\n\nPrevious feedback on your messages:\n${params.previousFeedback.map((f) => `- Step ${f.step}: "${f.feedback}"`).join("\n")}\nAdjust tone accordingly.`
    : "";

  const prompt = `You are a friendly debt-collection assistant for small businesses.
Generate a 3-step WhatsApp reminder sequence for an unpaid invoice.

Client: ${params.clientName}
Amount: $${params.amount.toLocaleString()}
Due date: ${params.dueDate}
Days overdue: ${params.daysOverdue}
${params.clientNotes ? `Notes: ${params.clientNotes}` : ""}

User's preferred vibe / tone: "${params.vibeTone}"

Payment link: ${params.paymentLink}
${feedbackBlock}

Rules for each message:
- Match the user's vibe description EXACTLY
- Include payment link naturally
- WhatsApp-friendly (short, a few emojis, concise)
- Include amount and client name

Step 1 — gentle first nudge (friendly)
Step 2 — firmer follow-up (+3 days, more direct)
Step 3 — final notice (+7 days, clear consequences, still respectful)

Return ONLY valid JSON: {"step1":"…","step2":"…","step3":"…"}`;

  const useGrok = process.env.XAI_API_KEY && !process.env.OPENAI_API_KEY;
  const model = useGrok ? "grok-2-latest" : "gpt-4o-mini";

  const res = await ai().chat.completions.create({
    model,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.8,
    max_tokens: 1500,
    response_format: { type: "json_object" },
  });

  const content = res.choices[0]?.message?.content;
  if (!content) throw new Error("Empty AI response");
  return JSON.parse(content);
}
