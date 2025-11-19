import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function handler(event) {
  // Only allow POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const { message } = JSON.parse(event.body || "{}");

    if (!message || typeof message !== "string") {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Missing or invalid 'message' field" }),
      };
    }

    // Call OpenAI Responses API
    const response = await client.responses.create({
      model: "gpt-4o-mini",
      instructions:
        "You are a concise, friendly assistant for Kit Baker-Bassett’s portfolio site. " +
        "Give short, clear answers. If asked about Kit, respond in the third person.",
      input: message,
    });

    // Convenient short-text helper
    const reply = response.output_text || "Sorry, I could not produce a reply.";

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reply }),
    };
  } catch (err) {
    console.error("Chat function error:", err);

    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: "Server error while talking to the AI",
      }),
    };
  }
}
