'use client';

import type { ReactNode } from 'react';
import { createContext, useCallback, useEffect, useState } from 'react';
import type { Flashcard } from '@/lib/types';

interface FlashcardContextType {
  flashcards: Flashcard[];
  addFlashcard: (card: Omit<Flashcard, 'id' | 'createdAt'>) => void;
  updateFlashcard: (id: string, card: Omit<Flashcard, 'id' | 'createdAt'>) => void;
  deleteFlashcard: (id: string) => void;
  getCardById: (id: string) => Flashcard | undefined;
  getCategories: () => string[];
  loading: boolean;
}

export const FlashcardContext = createContext<FlashcardContextType | undefined>(undefined);

export function FlashcardProvider({ children }: { children: ReactNode }) {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedCards = window.localStorage.getItem('flashcards');
      if (storedCards) {
        setFlashcards(JSON.parse(storedCards));
      }
    } catch (error) {
      console.error('Failed to load flashcards from local storage', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!loading) {
      try {
        window.localStorage.setItem('flashcards', JSON.stringify(flashcards));
      } catch (error) {
        console.error('Failed to save flashcards to local storage', error);
      }
    }
  }, [flashcards, loading]);

  const addFlashcard = useCallback((card: Omit<Flashcard, 'id' | 'createdAt'>) => {
    const newCard: Flashcard = {
      ...card,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setFlashcards((prev) => [newCard, ...prev]);
  }, []);

  const updateFlashcard = useCallback((id: string, updatedCardData: Omit<Flashcard, 'id' | 'createdAt'>) => {
    setFlashcards((prev) =>
      prev.map((card) =>
        card.id === id ? { ...card, ...updatedCardData } : card
      )
    );
  }, []);

  const deleteFlashcard = useCallback((id: string) => {
    setFlashcards((prev) => prev.filter((card) => card.id !== id));
  }, []);

  const getCardById = useCallback(
    (id: string) => flashcards.find((card) => card.id === id),
    [flashcards]
  );
  
  const getCategories = useCallback(() => {
    const categories = new Set(flashcards.map((card) => card.category));
    return Array.from(categories);
  }, [flashcards]);

  return (
    <FlashcardContext.Provider value={{ flashcards, addFlashcard, updateFlashcard, deleteFlashcard, getCardById, getCategories, loading }}>
      {children}
    </FlashcardContext.Provider>
  );
}
