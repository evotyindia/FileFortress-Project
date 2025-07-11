'use server';

/**
 * @fileOverview A GenAI flow to generate a creative filename.
 *
 * - generateFilename - A function that suggests a creative filename.
 * - GenerateFilenameInput - The input type for the generateFilename function.
 * - GenerateFilenameOutput - The return type for the generateFilename function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFilenameInputSchema = z.object({
  originalFilename: z.string().describe('The original filename to base the new name on, including its extension.'),
});
export type GenerateFilenameInput = z.infer<typeof GenerateFilenameInputSchema>;

const GenerateFilenameOutputSchema = z.object({
  newFilename: z.string().describe('The newly generated creative filename, without extension.'),
});
export type GenerateFilenameOutput = z.infer<typeof GenerateFilenameOutputSchema>;

export async function generateFilename(input: GenerateFilenameInput): Promise<GenerateFilenameOutput> {
  return generateFilenameFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFilenamePrompt',
  input: {schema: GenerateFilenameInputSchema},
  output: {schema: GenerateFilenameOutputSchema},
  prompt: `You are a creative naming assistant for a secure application called FileFortress. Your task is to generate cool, code-name style filenames.
  Based on the original filename and its extension, generate a new filename that sounds like a secret operation, a fortress, or a classified project.
  
  **The new filename MUST be a single word, between 20 and 25 characters long.**
  It should not contain spaces, dashes, or any special characters.

  Examples:
  - "family-photos.zip" -> "WhisperingAegisArchive"
  - "project-alpha-docs.docx" -> "ProjectRampartDocument"
  - "my-secret-diary.txt" -> "SilentScriptChronicle"
  - "budget.xlsx" -> "FinancialGuardianLedger"

  Only return the new filename.

  Original filename: {{{originalFilename}}}
  `,
});

const generateFilenameFlow = ai.defineFlow(
  {
    name: 'generateFilenameFlow',
    inputSchema: GenerateFilenameInputSchema,
    outputSchema: GenerateFilenameOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
