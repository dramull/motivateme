// src/ai/genkit.ts
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [googleAI({
    apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY
  })],
  model: 'googleai/gemini-2.0-flash',
  // Add this for production/serverless environments
  enableTracingAndMetrics: false,
  flowStateStore: 'none',
});
