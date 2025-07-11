// src/ai/flows/encryption-faq.ts
'use server';

/**
 * @fileOverview This flow is deprecated and has been replaced by chatbot-flow.ts
 *
 * - encryptionFAQChatbot - A function that handles the chatbot interaction.
 * - EncryptionFAQInput - The input type for the encryptionFAQChatbot function (just the user's message).
 * - EncryptionFAQOutput - The return type for the encryptionFAQChatbot function (the chatbot's response).
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EncryptionFAQInputSchema = z.object({
  message: z.string().describe('The user message to the chatbot.'),
});
export type EncryptionFAQInput = z.infer<typeof EncryptionFAQInputSchema>;

const EncryptionFAQOutputSchema = z.object({
  response: z.string().describe('The chatbot response to the user message.'),
});
export type EncryptionFAQOutput = z.infer<typeof EncryptionFAQOutputSchema>;

export async function encryptionFAQChatbot(input: EncryptionFAQInput): Promise<EncryptionFAQOutput> {
  return encryptionFAQChatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'encryptionFAQPrompt',
  input: {schema: EncryptionFAQInputSchema},
  output: {schema: EncryptionFAQOutputSchema},
  prompt: `You are a helpful chatbot assistant on the FileFortress website.

  FileFortress is a secure file encryption and decryption tool that operates entirely client-side.
  Users upload files, enter a password and security key, and the file is encrypted or decrypted in their browser.
  No files or keys are stored on the server.

  Answer questions about encryption, passwords, security keys, and how to use FileFortress.
  If the question is not related to encryption, passwords, security keys, or how to use FileFortress, respond with "I can only answer questions related to encryption, passwords, security keys, or how to use FileFortress."
  Be concise and easy to understand.

  User message: {{{message}}}
  `,
});

const encryptionFAQChatbotFlow = ai.defineFlow(
  {
    name: 'encryptionFAQChatbotFlow',
    inputSchema: EncryptionFAQInputSchema,
    outputSchema: EncryptionFAQOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
