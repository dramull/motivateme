// src/ai/genkit-server.ts
'use server';

import {genkit as genkitCore} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Lazy load genkit only when needed
let _ai: ReturnType<typeof genkitCore> | null = null;

export function getAI() {
  if (!_ai) {
    _ai = genkitCore({
      plugins: [googleAI({
        apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY
      })],
      model: 'googleai/gemini-2.0-flash',
      enableTracingAndMetrics: false,
      flowStateStore: 'none',
    });
  }
  return _ai;
}
