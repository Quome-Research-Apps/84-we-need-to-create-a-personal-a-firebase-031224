'use client';
import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { generateContentSuggestions } from '@/ai/flows/ai-powered-content-suggestions';
import { Skeleton } from './ui/skeleton';
import { ScrollArea } from './ui/scroll-area';

export function AISuggestions({ content }: { content: string }) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateSuggestions = async () => {
    if (!content) {
      setError("Please enter some content first.");
      return;
    }
    setLoading(true);
    setError(null);
    setSuggestions([]);
    try {
      const result = await generateContentSuggestions({ cardContent: content });
      if(result.suggestions.length === 0){
        setError("No suggestions found. Try being more specific.");
      }
      setSuggestions(result.suggestions);
    } catch (e) {
      console.error('Error generating AI suggestions:', e);
      setError('Failed to get suggestions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Popover onOpenChange={(isOpen) => { if (!isOpen) { setSuggestions([]); setError(null); } }}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="h-7 w-7" onClick={handleGenerateSuggestions}>
          <Sparkles className="h-4 w-4 text-accent" />
           <span className="sr-only">AI Suggestions</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none font-headline">Content Suggestions</h4>
            <p className="text-sm text-muted-foreground">
              AI-powered ideas to enhance your card.
            </p>
          </div>
          <div className="grid gap-2">
            {loading && (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-full" />
              </div>
            )}
            {error && <p className="text-sm text-destructive">{error}</p>}
            {!loading && !error && suggestions.length > 0 && (
               <ScrollArea className="h-48">
                <ul className="space-y-2">
                  {suggestions.map((suggestion, index) => (
                    <li key={index} className="text-sm p-3 bg-muted/50 rounded-md border">
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
