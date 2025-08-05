//  Prompt Builder

export default function buildPrompt(userPrompt, contextObj) {
  // Handle different context structures
  const context = contextObj.context || contextObj.instructions || "";
  const agent = contextObj.agent || "AI Assistant";
  const tone = contextObj.tone || "";

  let prompt = `You are ${agent}. ${context}\n\n`;

  if (tone) {
    prompt += `Tone: ${tone}\n\n`;
  }

  // Add examples if available
  if (contextObj.examples && Array.isArray(contextObj.examples)) {
    prompt += "Examples:\n";
    contextObj.examples.forEach((example) => {
      prompt += `User: ${example.user}\nAssistant: ${example.assistant}\n\n`;
    });
  }

  prompt += `User: ${userPrompt}\nAssistant:`;

  return prompt;
}
