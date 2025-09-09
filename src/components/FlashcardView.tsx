'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import './FlashcardView.css';
import { ScrollArea } from './ui/scroll-area';

interface FlashcardViewProps {
  question: string;
  answer: string;
  onFlip?: (isFlipped: boolean) => void;
}

export function FlashcardView({ question, answer, onFlip }: FlashcardViewProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    setIsFlipped(false);
  }, [question, answer]);

  const handleFlip = () => {
    const newFlippedState = !isFlipped;
    setIsFlipped(newFlippedState);
    onFlip?.(newFlippedState);
  };
  
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      handleFlip();
    }
  }

  return (
    <div 
        className="flip-card w-full h-full" 
        onClick={handleFlip}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label={`Flashcard. Front: ${question}. Press space or enter to flip.`}
    >
      <div className={cn('flip-card-inner', { 'is-flipped': isFlipped })}>
        <Card className="flip-card-front" aria-hidden={isFlipped}>
          <ScrollArea className="h-full w-full">
            <div className="p-6 flex items-center justify-center min-h-full">
                <p className="text-2xl md:text-3xl font-semibold font-headline">{question}</p>
            </div>
          </ScrollArea>
        </Card>
        <Card className="flip-card-back" aria-hidden={!isFlipped}>
          <ScrollArea className="h-full w-full">
            <div className="p-6 flex items-center justify-center min-h-full">
                <p className="text-xl md:text-2xl">{answer}</p>
            </div>
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
}
