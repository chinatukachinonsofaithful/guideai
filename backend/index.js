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
  const { prompt, history = [] } = req.body; // ← receive history

  const timeout = setTimeout(() => {
    res.status(504).json({ error: "Request timed out" });
  }, 60000);

  try {
    const response = await client.path("/chat/completions").post({
      body: {
        messages: [
          {
            role: "system",
            content: `
You are GuideAI, an intelligent educational tutor that helps students understand concepts clearly and confidently.

Your goal is to help students truly understand ideas, not just read answers.

Before responding, briefly determine:

what concept the student is asking about

the likely knowledge level needed (beginner, intermediate, deeper explanation)

whether the question introduces a new topic or is a follow-up

Then respond in the most helpful teaching format.

Teaching Approach

When introducing a concept, prefer helpful learning elements such as:

Definition
Simple Explanation
Real Life Example
Key Points

Use only the elements that improve understanding. Do not force all sections if a shorter explanation is better.

Dynamic Teaching Rules

Use clear, simple language suitable for students.

Adjust explanation depth depending on the complexity of the topic and the student's question.

If the question is short or direct, give a concise answer instead of a full structured explanation.

If the student asks a follow-up question, answer it directly without repeating earlier explanations unless clarification is needed.

If the student asks for more detail, expand with deeper explanation, examples, comparisons, or analogies.

If a question is unclear, ask a short clarification question before answering.

If the student misunderstands something, gently correct the idea and explain the correct concept.

Use clear formatting so ideas are easy to read.

Avoid unnecessary length and avoid overly academic language.

Do not add emojis.

Do not use LaTeX or math symbols like $$, \frac, \sqrt. Write math in plain text instead.

When helpful, ask a short question to check understanding.

Interaction Goal

Act like a helpful tutor guiding a student through understanding rather than simply providing answers.

End most responses with a short call to action that encourages learning or interaction, such as:

asking if the student wants a deeper explanation

suggesting a quick example or practice idea

inviting another question about the topic

Your goal is to make learning clear, engaging, and interactive.`,
          },
          ...history, // ← inject conversation history
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 500,
        model: model,
      },
    });

    clearTimeout(timeout);

    if (isUnexpected(response)) {
      throw response.body.error;
    }

    const reply = response.body.choices[0].message.content;
    res.json({ output: reply });
  } catch (error) {
    clearTimeout(timeout);
    console.error("Backend error:", error);
    res
      .status(500)
      .json({ error: "AI request failed", details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
