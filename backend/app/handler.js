//  Lambda Entry point.

import loadContext from "./context_loader.js";
import buildPrompt from "./prompt_builder.js";
import queryLLM from "./llm_client.js";
import getSecret from "./utils.js";

export const handler = async (event) => {
    try {

        const body = event.body ? JSON.parse(event.body) : {}; // agr event body exist krta h to use json me parse kro nhi to empty
        const userPrompt = body.prompt || ''; // agr body prompt h to uska value userPrompt me le lo
        const contextFile = body.context_file || 'demo_context.json'; // agr user k side se context file h to uska use kro nhi to demo_context

        if (!userPrompt) {
            return{
                statusCode: 400,
                headers: {'content-Type': 'application/json'},
                body: JSON.stringify({error: "Missing 'prompt' in request body"})
            }
        }

        const context = await loadContext(contextFile); // load context
        const llmApiKey = await getSecret(process.env.LLM_API_KEY_SECRET); //LLM api from .env

        const prompt = buildPrompt(userPrompt, context); // build prompt

        const llmResponse = await queryLLM(prompt, llmApiKey); // stores llm response after calling QueryLLM internally.

        return{
            statusCode:200,
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ response: llmResponse })
        }

    } catch (error) {
        console.error('Handler error:', error);
        return{
            statusCode: 500,
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({error: error.message || 'Unexpected error'}),
        };
    }
};