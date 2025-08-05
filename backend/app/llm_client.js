//  LLM HTTP rest client

import axios from "axios";

export default async function queryLLM(prompt, apiKey) {
  const endpoint = process.env.LLM_ENDPOINT;
  const model = process.env.LLM_MODEL;

  console.log("🤖 Calling LLM with model:", model);
  console.log("📝 Prompt length:", prompt.length);

  try {
    const response = await axios.post(
      endpoint,
      {
        model,
        prompt,
        max_tokens: 512,
        temperature: 0.7,
        stop: ["User:", "Human:", "Assistant:"],
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        timeout: 30000,
      }
    );

    console.log("✅ LLM response received");
    const result =
      response.data.choices?.[0]?.text?.trim() ||
      response.data.result ||
      "No response";
    return result;
  } catch (error) {
    console.error(
      "❌ LLM call failed:",
      error?.response?.data || error.message
    );
    console.error("🔍 Full error:", error);
    throw new Error(
      `LLM call error: ${error?.response?.data?.error || error.message}`
    );
  }
}
