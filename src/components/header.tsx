import { Moon, Star } from "lucide-react";

export function Header() {
  return (
    <header className="w-full text-center p-6 bg-primary/10 rounded-lg shadow-inner border border-primary/20">
      <div className="flex justify-center items-center gap-4">
        <Moon className="h-8 w-8 text-accent" />
        <h1 className="text-4xl font-bold font-headline text-primary tracking-tight sm:text-5xl">
          Udhiyath Allocator
        </h1>
        <Star className="h-8 w-8 text-accent" />
      </div>
      <p className="mt-3 text-lg text-muted-foreground">
        Manage Bakrid meat distribution with ease
      </p>
      <p className="mt-1 text-sm text-muted-foreground/80 italic">
        developed by Dr. Muhammed Rafi Hansani
      </p>
    </header>
  );
}
