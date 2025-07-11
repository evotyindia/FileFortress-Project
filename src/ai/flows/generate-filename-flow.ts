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
  prompt: `You are a creative naming assistant. Your task is to generate cool, evocative, and unique filenames.
  Based on the original filename and its extension, generate a new filename that subtly hints at the file's content or purpose.
  
  **The new filename MUST be a single word, between 20 and 25 characters long.**
  It should not contain spaces, dashes, or any special characters.

  Examples:
  - "family-photos.zip" -> "WhisperingImageCollection"
  - "project-alpha-docs.docx" -> "ProjectAlphaManuscript"
  - "my-secret-diary.txt" -> "SilentNarrativeChronicle"
  - "budget.xlsx" -> "QuantitativeDataLedger"

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
