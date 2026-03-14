/**
 * xAI Grok API integration for Safety Auditor and Simulate Distribution.
 * Uses https://api.x.ai/v1/chat/completions (OpenAI-compatible).
 */

const GROK_BASE = "https://api.x.ai/v1";
const MODEL = "grok-2-1212";

export interface GrokSafetyResult {
  score: number;
  issues: Array<{ severity: "critical" | "warning" | "info"; category: string; description: string; fix: string }>;
  summary: string;
}

export interface GrokInvocationExample {
  platform: string;
  agentName: string;
  query: string;
  response: string;
  revenueImpact: number;
}

async function callGrok(apiKey: string, systemPrompt: string, userContent: string): Promise<string> {
  const res = await fetch(`${GROK_BASE}/chat/completions`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userContent },
      ],
      temperature: 0.3,
      max_tokens: 4000,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Grok API error ${res.status}: ${err}`);
  }

  const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
  const content = data?.choices?.[0]?.message?.content;
  if (!content) throw new Error("Empty response from Grok API");
  return content;
}

/**
 * Run a real safety audit using Grok. Scans for prompt injection, tool poisoning,
 * local-agent risks, and compliance issues.
 */
export async function runSafetyAuditWithGrok(
  apiKey: string,
  productName: string,
  productDescription: string,
  apiSpec: string | null
): Promise<GrokSafetyResult> {
  const systemPrompt = `You are Invokex's Safety Auditor. Analyze the provided product/agent for security and compliance risks.

Your task: Return a JSON object ONLY, no other text. Use this exact structure:
{
  "score": <number 0-100>,
  "summary": "<one sentence overall assessment>",
  "issues": [
    {
      "severity": "critical" | "warning" | "info",
      "category": "<e.g. Prompt Injection, Tool Poisoning, Local Agent Risk, Compliance>",
      "description": "<what you found>",
      "fix": "<concrete recommended fix>"
    }
  ]
}

Scan for:
1. Prompt injection — inputs that could override system prompts or inject malicious instructions
2. Tool poisoning — API responses that could corrupt agent behavior or leak data
3. Local agent risks — code execution, file system access, or privilege escalation
4. Compliance — PII exposure, insecure auth, missing rate limits
5. Sensitive data in descriptions or API specs

Be thorough but realistic. score 90+ = production-ready, 70-89 = needs minor fixes, <70 = significant issues.`;

  const userContent = `Product: ${productName}

Description:
${productDescription}

${apiSpec ? `API Specification:\n${apiSpec.slice(0, 8000)}` : "No API spec provided."}`;

  const raw = await callGrok(apiKey, systemPrompt, userContent);
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  const jsonStr = jsonMatch ? jsonMatch[0] : raw;

  try {
    const parsed = JSON.parse(jsonStr) as GrokSafetyResult;
    if (typeof parsed.score !== "number") parsed.score = Math.min(100, Math.max(0, Number(parsed.score) || 75));
    if (!Array.isArray(parsed.issues)) parsed.issues = [];
    if (!parsed.summary) parsed.summary = "Safety audit completed.";
    return parsed;
  } catch {
    return {
      score: 75,
      issues: [{ severity: "info", category: "Audit", description: "Could not parse Grok response.", fix: "Review the product manually." }],
      summary: "Safety audit completed with parsing fallback.",
    };
  }
}

/**
 * Generate 3 realistic, context-aware agent invocation examples using Grok.
 */
export async function generateSimulationInvocations(
  apiKey: string,
  productName: string,
  productDescription: string
): Promise<GrokInvocationExample[]> {
  const systemPrompt = `You are simulating how AI agents (ChatGPT, Claude, Grok, Moltbook) would discover and invoke a developer tool.

Return a JSON array ONLY with exactly 3 objects. Each object:
{
  "platform": "chatgpt" | "claude" | "grok" | "moltbook",
  "agentName": "<realistic agent name like 'GPT-4o Agent', 'Claude 3.7 Sonnet', 'Grok-3', 'Moltbook Runner v2'>",
  "query": "<realistic user/agent query that would trigger use of this tool>",
  "response": "<realistic 1-2 sentence response the tool would return>",
  "revenueImpact": <number 0.5 to 3.0, estimated value of this invocation>
}

Make each example:
- Unique platform (one per: chatgpt, claude, grok, moltbook)
- Realistic queries a developer or coding agent would ask
- Context-aware to the product
- Varied revenue impact (e.g. 0.8, 1.5, 2.2)`;

  const userContent = `Product: ${productName}

Description: ${productDescription}

Generate 3 realistic agent invocation examples.`;

  const raw = await callGrok(apiKey, systemPrompt, userContent);
  const jsonMatch = raw.match(/\[[\s\S]*\]/);
  const jsonStr = jsonMatch ? jsonMatch[0] : `[]`;

  try {
    const parsed = JSON.parse(jsonStr) as GrokInvocationExample[];
    const valid = Array.isArray(parsed) ? parsed.slice(0, 3) : [];
    return valid.map((v) => ({
      platform: ["chatgpt", "claude", "grok", "moltbook"].includes(String(v.platform).toLowerCase())
        ? String(v.platform).toLowerCase()
        : "chatgpt",
      agentName: String(v.agentName || "AI Agent").slice(0, 80),
      query: String(v.query || "").slice(0, 500),
      response: String(v.response || "").slice(0, 500),
      revenueImpact: Math.min(5, Math.max(0.1, Number(v.revenueImpact) || 1)),
    }));
  } catch {
    return [];
  }
}
