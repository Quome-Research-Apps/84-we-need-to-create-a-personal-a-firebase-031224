'use client';

import { useState, useMemo } from 'react';
import { PlusCircle, Edit, Trash2, BookOpen } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FlashcardForm } from '@/components/FlashcardForm';
import { useFlashcards } from '@/hooks/use-flashcards';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { NoCards } from '@/components/NoCards';
import { Skeleton } from '@/components/ui/skeleton';

export default function LibraryPage() {
  const { flashcards, deleteFlashcard, getCategories, loading, getCardById } = useFlashcards();
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = useMemo(() => ['all', ...getCategories()], [getCategories]);
  
  const filteredFlashcards = useMemo(() => {
    if (selectedCategory === 'all') {
      return flashcards;
    }
    return flashcards.filter((card) => card.category === selectedCategory);
  }, [flashcards, selectedCategory]);

  const editingCard = useMemo(() => {
    if (!editingCardId) return null;
    return getCardById(editingCardId) || null;
  }, [editingCardId, getCardById]);
  
  const openCreateModal = () => {
    setEditingCardId(null);
    setModalOpen(true);
  }

  const openEditModal = (id: string) => {
    setEditingCardId(id);
    setModalOpen(true);
  }

  const handleModalClose = () => {
    setModalOpen(false);
    // A delay to allow the dialog to close before resetting the card, preventing content flash
    setTimeout(() => setEditingCardId(null), 300);
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-48 rounded-lg" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[425px]" onInteractOutside={handleModalClose}>
          <DialogHeader>
            <DialogTitle className="font-headline">{editingCardId ? 'Edit Flashcard' : 'Create New Flashcard'}</DialogTitle>
          </DialogHeader>
          <FlashcardForm card={editingCard} onFinished={handleModalClose} />
        </DialogContent>
      </Dialog>
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold font-headline">My Library</h1>
        <div className="flex items-center gap-4">
          <Select value={selectedCategory} onValueChange={setSelectedCategory} disabled={flashcards.length === 0}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Categories</SelectLabel>
                {categories.map(cat => <SelectItem key={cat} value={cat} className="capitalize">{cat}</SelectItem>)}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button onClick={openCreateModal}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Card
          </Button>
        </div>
      </div>

      {flashcards.length === 0 ? (
        <NoCards onAddClick={openCreateModal} />
      ) : filteredFlashcards.length === 0 ? (
        <div className="text-center p-8 border-2 border-dashed rounded-lg mt-8">
            <h3 className="mt-4 text-lg font-medium font-headline">No cards in this category</h3>
            <p className="mt-1 text-sm text-muted-foreground">
                Select another category or create a new card in '{selectedCategory}'.
            </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFlashcards.map((card) => (
              <Card key={card.id} className="flex flex-col hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-lg line-clamp-2 font-headline">{card.question}</CardTitle>
                  <CardDescription>
                    <Badge variant="secondary" className="capitalize">{card.category}</Badge>
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground line-clamp-3">{card.answer}</p>
                </CardContent>
                <CardFooter className="flex justify-end gap-2 border-t pt-4 mt-auto">
                  <Button variant="ghost" size="icon" onClick={() => openEditModal(card.id)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete this flashcard.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteFlashcard(card.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              </Card>
            ))}
          </div>
           {selectedCategory !== 'all' && (
            <div className="mt-12 text-center">
                <Button asChild size="lg">
                    <Link href={`/study?category=${selectedCategory}`}>
                        <BookOpen className="mr-2 h-4 w-4" />
                        Study '{selectedCategory}' ({filteredFlashcards.length} cards)
                    </Link>
                </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
