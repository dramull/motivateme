// src/ai/genkit.ts
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [googleAI({
    apiKey: GEMINI_API_KEY || GOOGLE_GENAI_API_KEY
  })],
  model: 'googleai/gemini-2.0-flash',
  // Add these two lines for Netlify
  enableTracingAndMetrics: false,
  flowStateStore: 'none',
});
