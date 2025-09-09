'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useFlashcards } from '@/hooks/use-flashcards';
import { useToast } from '@/hooks/use-toast';
import type { Flashcard } from '@/lib/types';
import { useEffect } from 'react';
import { AISuggestions } from './AISuggestions';

const formSchema = z.object({
  question: z.string().min(1, 'Question is required.'),
  answer: z.string().min(1, 'Answer is required.'),
  category: z.string().min(1, 'Category is required.').transform(val => val.toLowerCase()),
});

type FlashcardFormValues = z.infer<typeof formSchema>;

interface FlashcardFormProps {
  card?: Flashcard | null;
  onFinished: () => void;
}

export function FlashcardForm({ card, onFinished }: FlashcardFormProps) {
  const { addFlashcard, updateFlashcard } = useFlashcards();
  const { toast } = useToast();

  const form = useForm<FlashcardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: '',
      answer: '',
      category: '',
    },
  });

  useEffect(() => {
    form.reset(card || { question: '', answer: '', category: '' });
  }, [card, form]);

  const questionValue = form.watch('question');
  const answerValue = form.watch('answer');

  function onSubmit(data: FlashcardFormValues) {
    if (card) {
      updateFlashcard(card.id, data);
      toast({ title: 'Success', description: 'Flashcard updated successfully.' });
    } else {
      addFlashcard(data);
      toast({ title: 'Success', description: 'Flashcard created successfully.' });
    }
    onFinished();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="question"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between items-center">
                <FormLabel>Question</FormLabel>
                <AISuggestions content={questionValue} />
              </div>
              <FormControl>
                <Textarea placeholder="e.g., What is photosynthesis?" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="answer"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between items-center">
                <FormLabel>Answer</FormLabel>
                <AISuggestions content={answerValue} />
              </div>
              <FormControl>
                <Textarea rows={5} placeholder="e.g., The process by which green plants use sunlight..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Biology" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end pt-4">
          <Button type="submit">{card ? 'Update Card' : 'Create Card'}</Button>
        </div>
      </form>
    </Form>
  );
}
