import Link from 'next/link';
import { BrainCircuit, Library, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Header() {
  return (
    <header className="bg-card/80 border-b backdrop-blur-sm sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link href="/" className="flex items-center gap-2 text-2xl font-headline font-bold text-primary">
          <BrainCircuit className="h-7 w-7" />
          Flashcard Focus
        </Link>
        <nav className="flex items-center gap-2">
          <Button asChild variant="ghost">
            <Link href="/">
              <Library className="mr-2 h-4 w-4" />
              My Library
            </Link>
          </Button>
          <Button asChild>
            <Link href="/study">
              <Sparkles className="mr-2 h-4 w-4" />
              Study Mode
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
