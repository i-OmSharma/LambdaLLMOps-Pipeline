//  Secrets

import AWS from "aws-sdk";

const secretManager = new AWS.SecretsManager();

export default async function getSecret(secretId) {
    try {
        const response = await secretManager.getSecretValue({ SecretId: secretId}).promise();
        const val = response.SecretString;
        if(val.startsWith('{')) return JSON.parse(val).api_key;
        return val;
    } catch (error) {
        console.error('Secret fetch error:', error);
        throw new Error("Could not fetch LLM API key");
    }
}