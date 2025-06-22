"use client";

import { useState } from "react";
import { Accordion } from "@/components/ui/accordion";
import { AnimalCard } from "@/components/animal-card";
import { AnimalForm } from "@/components/animal-form";
import { Header } from "@/components/header";
import { PublicSummaryCard } from "@/components/public-summary-card";
import type { CalculatedAnimalData } from "@/lib/types";

export default function Home() {
  const [animals, setAnimals] = useState<CalculatedAnimalData[]>([]);

  const handleAddAnimal = (newAnimal: CalculatedAnimalData) => {
    setAnimals((prev) => {
      const existingIndex = prev.findIndex((a) => a.id === newAnimal.id);
      if (existingIndex > -1) {
        const updatedAnimals = [...prev];
        updatedAnimals[existingIndex] = newAnimal;
        return updatedAnimals;
      }
      return [...prev, newAnimal].sort((a,b) => a.id.localeCompare(b.id));
    });
  };

  return (
    <main className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-4xl mx-auto flex flex-col gap-12">
        <Header />
        <AnimalForm onAddAnimal={handleAddAnimal} />
        
        {animals.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-3xl font-bold font-headline text-center text-primary">
              Animal Summaries
            </h2>
            <Accordion type="multiple" className="w-full space-y-4">
              {animals.map((animal) => (
                <AnimalCard key={animal.id} animal={animal} />
              ))}
            </Accordion>
          </section>
        )}
        
        {animals.length > 0 && <PublicSummaryCard animals={animals} />}
      </div>
    </main>
  );
}
