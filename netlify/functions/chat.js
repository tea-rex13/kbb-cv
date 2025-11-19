// netlify/functions/chat.js

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error("Missing OPENAI_API_KEY");
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Server misconfiguration: missing API key" }),
      };
    }

    const { message } = JSON.parse(event.body || "{}");

    if (!message || typeof message !== "string") {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Missing or invalid 'message' field" }),
      };
    }

    // Call OpenAI Responses API via HTTP
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        instructions:
          "You are a concise, friendly assistant for Kit Baker-Bassett’s portfolio site. " +
          "Answer clearly and briefly. If asked about Kit, speak in the third person.",
        input: message,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI error:", response.status, errorText);
      return {
        statusCode: 502,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Error from AI service" }),
      };
    }

    const data = await response.json();

    // Extract assistant text from Responses API structure
    let reply = "Sorry, I could not produce a reply.";
    try {
      const messageObj = data.output?.[0];
      const contentItem = messageObj?.content?.[0];
      reply = contentItem?.text?.value || reply;
    } catch (e) {
      // leave default reply
    }

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
};
