// src/ai/flows/generate-motivational-message.ts
'use server';
/**
 * @fileOverview Generates a motivational message using an LLM.
 *
 * - generateMotivationalMessage - A function that generates a motivational message.
 * - GenerateMotivationalMessageInput - The input type for the generateMotivationalMessage function.
 * - GenerateMotivationalMessageOutput - The return type for the generateMotivationalMessage function.
 */
import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';

const GenerateMotivationalMessageInputSchema = z.object({
  category: z.string().describe('The category for the motivational message (e.g., School, Parents, Friends, Sports).'),
});
export type GenerateMotivationalMessageInput = z.infer<typeof GenerateMotivationalMessageInputSchema>;

const GenerateMotivationalMessageOutputSchema = z.object({
  message: z.string().describe('The motivational message.'),
  audio: z.string().describe('The audio of the motivational message.'),
});
export type GenerateMotivationalMessageOutput = z.infer<typeof GenerateMotivationalMessageOutputSchema>;

export async function generateMotivationalMessage(input: GenerateMotivationalMessageInput): Promise<GenerateMotivationalMessageOutput> {
  // Step 1: Generate text using the default model (gemini-2.0-flash)
  const response = await ai.generate({
    prompt: `You are a motivational coach for late teenagers. Generate a short, profound motivational message tailored for a late teen dealing with challenges related to ${input.category}. The message should be inspiring and resonant with that age group. Keep it concise (1-2 sentences). Do not include any emojis.`,
  });
  
  const message = response.text;
  
  if (!message) {
    throw new Error("The motivational message could not be generated.");
  }
  
  // Step 2: Convert text to speech using the TTS-specific model
  const { media } = await ai.generate({
    model: 'googleai/gemini-2.5-flash-preview-tts',
    config: {
      responseModalities: ['AUDIO'],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Algenib' },
        },
      },
    },
    prompt: message,
  });
  
  if (!media) {
    throw new Error('no media returned');
  }
  
  const audioBuffer = Buffer.from(
    media.url.substring(media.url.indexOf(',') + 1),
    'base64'
  );
  
  const audio = 'data:audio/wav;base64,' + (await toWav(audioBuffer));
  
  return { message, audio };
}

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });
    
    let bufs = [] as any[];
    
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });
    
    writer.write(pcmData);
    writer.end();
  });
}
