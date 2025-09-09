'use server';

/**
 * @fileOverview AI-powered content suggestions for flashcards.
 *
 * This file defines a Genkit flow that suggests definitions and examples
 * related to the content a student has entered on their flashcard.
 *
 * @file AIPoweredContentSuggestions
 * @exported function: generateContentSuggestions - Generates content suggestions for flashcards.
 * @exported type: ContentSuggestionsInput - Input type for content suggestions.
 * @exported type: ContentSuggestionsOutput - Output type for content suggestions.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ContentSuggestionsInputSchema = z.object({
  cardContent: z.string().describe('The content of the flashcard (question or answer).'),
});
export type ContentSuggestionsInput = z.infer<typeof ContentSuggestionsInputSchema>;

const ContentSuggestionsOutputSchema = z.object({
  suggestions: z.array(z.string()).describe('A list of suggested definitions and examples.'),
});
export type ContentSuggestionsOutput = z.infer<typeof ContentSuggestionsOutputSchema>;

export async function generateContentSuggestions(input: ContentSuggestionsInput): Promise<ContentSuggestionsOutput> {
  return aiPoweredContentSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'contentSuggestionsPrompt',
  input: {
    schema: ContentSuggestionsInputSchema,
  },
  output: {
    schema: ContentSuggestionsOutputSchema,
  },
  prompt: `You are an AI assistant designed to help students learn by suggesting definitions and examples related to their flashcard content.

  Given the following flashcard content, provide a list of definitions and examples that would enhance the student's understanding.

  Flashcard Content: {{{cardContent}}}

  Suggestions (delimited by newlines):`,
});

const aiPoweredContentSuggestionsFlow = ai.defineFlow(
  {
    name: 'aiPoweredContentSuggestionsFlow',
    inputSchema: ContentSuggestionsInputSchema,
    outputSchema: ContentSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
