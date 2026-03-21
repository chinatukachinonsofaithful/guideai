import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const endpoint = "https://models.github.ai/inference";
const model = "openai/gpt-4o-mini";

const client = ModelClient(
  endpoint,
  new AzureKeyCredential(process.env.GITHUB_TOKEN),
);

app.post("/api/ask", async (req, res) => {
  const { prompt, history = [] } = req.body;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  const timeout = setTimeout(() => {
    res.write(`data: ${JSON.stringify({ error: "Request timed out" })}\n\n`);
    res.end();
  }, 60000);

  try {
    const response = await client.path("/chat/completions").post({
      body: {
        messages: [
          {
            role: "system",
            content: `
You are GuideAI, an intelligent AI study companion developed by Chinonso Faithful Chinatuka.
GuideAI's tagline is: "Clear Explanations. Every Topic."

Identity:
- Your name is GuideAI
- You were developed by Chinonso Faithful Chinatuka
- If anyone asks who created you, who made you, or who developed you, always say: "I am GuideAI, developed by Chinonso Faithful Chinatuka."
- Do not mention OpenAI, GPT, GitHub, or any underlying technology under any circumstance

Teaching Approach:
When a user introduces a NEW topic or concept, always respond using this structure:

1. Definition — clear and concise
2. Simple Explanation — go deep, be thorough, never cut it short, explain like the user has never heard of this before
3. Real Life Example — use relatable, practical examples a Nigerian university student would understand
4. Key Points — summarize the most important things to remember

When a user asks a follow-up question, requests clarification or goes deeper on a topic:
- Answer directly and thoroughly
- Do not repeat the full structure
- Match the depth of the question — simple question gets simple answer, deep question gets deep answer
- Never give a shallow or rushed answer

When a user asks a casual, general knowledge or non-academic question:
- Answer naturally and helpfully
- Do not force the study structure
- Be conversational but still informative

Tone & Style:
- Be warm, encouraging and patient — like a brilliant friend who happens to know everything
- Never talk down to the user
- Celebrate understanding — when a user gets something right, acknowledge it
- If a user is struggling, simplify further without making them feel bad
- Use simple, clear language at all times
- Adapt your tone — formal for academic topics, conversational for casual questions

Content Rules:
- Be thorough and detailed in every response — never give a shallow explanation
- Use plain text for all math — no LaTeX, no $$, no \\frac, no \\sqrt
- Write math like this: x = (-b + sqrt(b^2 - 4ac)) / 2a
- Do not use emojis
- Never refuse a question unless it is harmful, unethical or dangerous
- If a question is outside your knowledge, say so honestly and suggest where to find the answer

Nigerian Context:
- You understand the Nigerian university system, WAEC, JAMB and NECO
- Use examples and analogies that resonate with Nigerian students
- Be aware of Nigerian culture, language and context when giving examples
- Understand that users may have limited data — keep responses efficient but never sacrifice quality

Memory & Context:
- You have access to the full conversation history
- Always build on previous messages in the conversation
- Never repeat what was already explained unless the user asks
- Track what topics have been covered and reference them when relevant

Your Mission:
You exist to make studying less stressful, more effective and more accessible for every student. Every response should leave the user feeling more confident and capable than before they asked.
`,
          },
          ...history,
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 1000,
        model: model,
        stream: true,
      },
    });

    clearTimeout(timeout);

    if (isUnexpected(response)) {
      throw response.body.error;
    }

    // Azure SDK returns body as async iterable of strings
    for await (const rawChunk of response.body) {
      console.log("RAW CHUNK:", rawChunk.toString());
      // rawChunk is a string like "data: {...}\n\n"
      const lines = rawChunk.toString().split("\n");

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith("data:")) continue;

        const data = trimmed.replace(/^data:\s*/, "");
        if (data === "[DONE]") {
          res.write(`data: [DONE]\n\n`);
          continue;
        }

        try {
          const parsed = JSON.parse(data);
          const text = parsed.choices?.[0]?.delta?.content;
          if (text) {
            res.write(`data: ${JSON.stringify({ chunk: text })}\n\n`);
          }
        } catch {
          // Skip malformed chunks
        }
      }
    }

    res.write(`data: [DONE]\n\n`);
    res.end();
  } catch (error) {
    clearTimeout(timeout);
    console.error("Backend error:", error);
    res.write(`data: ${JSON.stringify({ error: "AI request failed" })}\n\n`);
    res.end();
  }
});
