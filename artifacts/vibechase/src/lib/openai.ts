import OpenAI from "openai";

let _openai: OpenAI | null = null;

function getOpenAI(): OpenAI {
  if (!_openai) {
    _openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || process.env.XAI_API_KEY || "placeholder",
      baseURL: process.env.XAI_API_KEY && !process.env.OPENAI_API_KEY
        ? "https://api.x.ai/v1"
        : undefined,
    });
  }
  return _openai;
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

export async function generateChaseSequence(params: GenerateChaseParams): Promise<{
  step1: string;
  step2: string;
  step3: string;
}> {
  const feedbackContext = params.previousFeedback?.length
    ? `\n\nPrevious feedback from this user on chase messages:\n${params.previousFeedback
        .map((f) => `- Step ${f.step}: "${f.feedback}"`)
        .join("\n")}\nAdjust your tone based on this feedback.`
    : "";

  const prompt = `You are a friendly debt collection assistant for small businesses. Generate a 3-step WhatsApp reminder sequence for an unpaid invoice.

Client: ${params.clientName}
Amount: $${params.amount.toLocaleString()}
Due date: ${params.dueDate}
Days overdue: ${params.daysOverdue}
${params.clientNotes ? `Notes about client: ${params.clientNotes}` : ""}

The user's preferred tone/vibe: "${params.vibeTone}"

Payment link: ${params.paymentLink}
${feedbackContext}

Generate exactly 3 messages:
- Step 1: Gentle first reminder (friendly, casual)
- Step 2: Firmer follow-up (3 days after step 1, slightly more direct)  
- Step 3: Final notice (7 days after step 1, very clear about consequences but still respectful)

Each message should:
- Match the user's vibe/tone description EXACTLY
- Include the payment link naturally
- Be suitable for WhatsApp (use emojis sparingly, keep it concise)
- Include the amount and client name

Return ONLY valid JSON in this exact format:
{"step1": "message text", "step2": "message text", "step3": "message text"}`;

  const model = process.env.XAI_API_KEY && !process.env.OPENAI_API_KEY
    ? "grok-2-latest"
    : "gpt-4o-mini";

  const completion = await getOpenAI().chat.completions.create({
    model,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.8,
    max_tokens: 1500,
    response_format: { type: "json_object" },
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) throw new Error("No response from AI");

  return JSON.parse(content);
}
