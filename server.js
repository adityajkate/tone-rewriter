import express from "express";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: "https://integrate.api.nvidia.com/v1",
});

const app = express();
app.use(express.json());
app.use(express.static("public"));

app.post("/api/rewrite", async (req, res) => {
  const { text, tone } = req.body;
  if (!text || !tone) {
    return res.status(400).json({ error: "text and tone are required" });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "deepseek-ai/deepseek-v4-pro",
      messages: [
        {
          role: "system",
          content: `Rewrite the user's text in a ${tone} tone Keep the original meaning and language. Reply with the rewritten text only, with no preamble, quotes, or commentary.`,
        },
        { role: "user", content: text },
      ],
      temperature: 1,
      top_p: 0.95,
      max_tokens: 16384,
      stream: false,
    });

    res.json({ result: completion.choices[0]?.message?.content ?? "" });
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("Listening on http://localhost:3000"));
