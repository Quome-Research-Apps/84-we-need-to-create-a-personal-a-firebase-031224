'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, ArrowRight, Shuffle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { FlashcardView } from '@/components/FlashcardView';
import { useFlashcards } from '@/hooks/use-flashcards';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

// Fisher-Yates shuffle
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export default function StudyPage() {
  const { flashcards, loading } = useFlashcards();
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  
  const [shuffledCards, setShuffledCards] = useState<typeof flashcards>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const cardsToStudy = useMemo(() => {
    if (!category || category === 'all') return flashcards;
    return flashcards.filter(c => c.category === category);
  }, [flashcards, category]);

  const handleShuffle = useCallback(() => {
    setShuffledCards(shuffleArray(cardsToStudy));
    setCurrentIndex(0);
  }, [cardsToStudy]);

  useEffect(() => {
    if (cardsToStudy.length > 0) {
      handleShuffle();
    }
  }, [cardsToStudy, handleShuffle]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % shuffledCards.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + shuffledCards.length) % shuffledCards.length);
  };
  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        handleNext();
      } else if (event.key === 'ArrowLeft') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [shuffledCards]);


  const currentCard = shuffledCards[currentIndex];
  const progress = shuffledCards.length > 0 ? ((currentIndex + 1) / shuffledCards.length) * 100 : 0;

  if (loading) {
    return (
        <div className="container mx-auto p-4 md:p-8 flex flex-col items-center justify-center h-[calc(100vh-81px)]">
            <Skeleton className="w-full max-w-2xl h-96" />
            <div className="flex gap-4 mt-8">
                <Skeleton className="h-12 w-24" />
                <Skeleton className="h-12 w-24" />
            </div>
        </div>
    );
  }

  if (cardsToStudy.length === 0) {
    return (
        <div className="container mx-auto p-4 md:p-8 h-full flex items-center justify-center">
             <Card className="w-full max-w-md text-center">
                <CardContent className="p-8">
                    <h2 className="text-2xl font-bold font-headline mb-4">No cards to study!</h2>
                    <CardDescription>
                        {category && category !== 'all' 
                            ? `There are no cards in the "${category}" category.` 
                            : "You haven't created any flashcards yet."}
                    </CardDescription>
                    <Button asChild className="mt-6">
                        <Link href="/">Go to Library</Link>
                    </Button>
                </CardContent>
             </Card>
        </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-8 flex flex-col items-center h-[calc(100vh-81px)]">
      <div className="w-full max-w-2xl mb-4">
        <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-muted-foreground font-medium">
                Card {currentIndex + 1} of {shuffledCards.length}
            </p>
            <Button variant="outline" size="sm" onClick={handleShuffle}>
                <Shuffle className="mr-2 h-4 w-4" />
                Shuffle
            </Button>
        </div>
        <Progress value={progress} className="w-full" />
      </div>
      
      <div className="w-full max-w-2xl flex-grow flex items-center justify-center my-4">
        <div className="w-full h-80 md:h-96">
            {currentCard && <FlashcardView key={currentCard.id} question={currentCard.question} answer={currentCard.answer} />}
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 mt-4 md:mt-8">
        <Button variant="outline" size="lg" onClick={handlePrev} aria-label="Previous Card">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <Button variant="default" size="lg" onClick={handleNext} className="bg-primary hover:bg-primary/90" aria-label="Next Card">
          <ArrowRight className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
