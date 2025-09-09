import { BrainCircuit, PlusCircle } from "lucide-react"
import { Button } from "./ui/button";

interface NoCardsProps {
    onAddClick: () => void;
}

export function NoCards({ onAddClick }: NoCardsProps) {
    return (
        <div className="text-center p-8 mt-8 border-2 border-dashed rounded-lg bg-card">
            <BrainCircuit className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium font-headline">Your library is empty</h3>
            <p className="mt-1 text-sm text-muted-foreground">
                Get started by creating your first flashcard.
            </p>
            <div className="mt-6">
                <Button
                    onClick={onAddClick}
                    type="button"
                >
                    <PlusCircle className="-ml-1 mr-2 h-5 w-5" />
                    New Flashcard
                </Button>
            </div>
        </div>
    )
}
