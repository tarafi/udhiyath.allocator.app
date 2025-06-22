"use client";

import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Accordion } from "@/components/ui/accordion";
import { AnimalCard } from "@/components/animal-card";
import { AnimalForm } from "@/components/animal-form";
import { Header } from "@/components/header";
import { PublicSummaryCard } from "@/components/public-summary-card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import type { CalculatedAnimalData } from "@/lib/types";

export default function Home() {
  const [animals, setAnimals] = useState<CalculatedAnimalData[]>([]);
  const [editingAnimal, setEditingAnimal] = useState<CalculatedAnimalData | null>(null);

  // State lifted from PublicSummaryCard
  const [households, setHouseholds] = useState("130");
  const [meatTakenOut, setMeatTakenOut] = useState("");
  const [boneTakenOut, setBoneTakenOut] = useState("");
  const [liverTakenOut, setLiverTakenOut] = useState("");

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
    setEditingAnimal(null);
  };

  const handleEdit = (animalId: string) => {
    const animalToEdit = animals.find((a) => a.id === animalId);
    if (animalToEdit) {
      setEditingAnimal(animalToEdit);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleClearForm = () => {
    setEditingAnimal(null);
  }

  const formatWeight = (weight: number) => weight.toFixed(2);

  const handleDownloadPdf = () => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.text("Ud'hiyath Allocation Report", 105, 15, { align: "center" });
    doc.setFontSize(10);
    doc.text(new Date().toLocaleString(), 105, 22, { align: "center" });

    let yPos = 30;

    // Animal Summaries
    animals.forEach(animal => {
        if (yPos > 250) { // Add new page if content overflows
            doc.addPage();
            yPos = 15;
        }

        doc.setFontSize(16);
        doc.text(`Animal Summary: ${animal.id}`, 14, yPos);
        yPos += 5;

        autoTable(doc, {
            startY: yPos,
            head: [['Category', "Owner's Share", 'Public Share', 'Total Weight']],
            body: [
                ['Meat', `${formatWeight(animal.shares.owner.meat)} kg`, `${formatWeight(animal.shares.public.meat)} kg`, `${formatWeight(animal.totals.meat)} kg`],
                ['Bone', `${formatWeight(animal.shares.owner.bone)} kg`, `${formatWeight(animal.shares.public.bone)} kg`, `${formatWeight(animal.totals.bone)} kg`],
                ['Liver', `${formatWeight(animal.shares.owner.liver)} kg`, `${formatWeight(animal.shares.public.liver)} kg`, `${formatWeight(animal.totals.liver)} kg`],
            ],
            foot: [
                ['TOTAL', `${formatWeight(animal.shares.owner.total)} kg`, `${formatWeight(animal.shares.public.total)} kg`, `${formatWeight(animal.totals.all)} kg`],
            ],
            headStyles: { fillColor: [33, 150, 243] }, // Primary color
            footStyles: { fillColor: [227, 242, 253], textColor: [0, 0, 0], fontStyle: 'bold' },
            theme: 'grid'
        });

        yPos = (doc as any).lastAutoTable.finalY + 10;
        
        doc.setFontSize(12);
        doc.text("Individual Owner's Share (1 of 7):", 14, yPos);
        yPos += 2;

        autoTable(doc, {
             startY: yPos,
             body: [
                 ['Meat', `${formatWeight(animal.shares.owner.meat / 7)} kg`],
                 ['Bone', `${formatWeight(animal.shares.owner.bone / 7)} kg`],
                 ['Liver', `${formatWeight(animal.shares.owner.liver / 7)} kg`],
                 ['Total', `${formatWeight(animal.shares.owner.total / 7)} kg`],
             ],
             theme: 'plain',
             styles: { fontSize: 10 },
             columnStyles: { 0: { fontStyle: 'bold' } },
        });

        yPos = (doc as any).lastAutoTable.finalY + 15;
    });

    // Public Distribution Summary
    if (animals.length > 0 && yPos > 190) { // Check if we need to add a page
        doc.addPage();
        yPos = 15;
    }

    if (animals.length > 0) {
      doc.setFontSize(16);
      doc.text("Public Distribution Summary", 105, yPos, { align: "center" });
      yPos += 10;
      
      // Calculations for summary
      const publicTotals = animals.reduce((acc, animal) => {
          acc.meat += animal.shares.public.meat;
          acc.bone += animal.shares.public.bone;
          acc.liver += animal.shares.public.liver;
          return acc;
      }, { meat: 0, bone: 0, liver: 0 });

      const netPublicMeat = publicTotals.meat - (parseFloat(meatTakenOut) || 0);
      const netPublicBone = publicTotals.bone - (parseFloat(boneTakenOut) || 0);
      const netPublicLiver = publicTotals.liver - (parseFloat(liverTakenOut) || 0);
      const validHouseholds = parseInt(households, 10) > 0 ? parseInt(households, 10) : 1;

      const perHousehold = {
          meat: netPublicMeat > 0 ? netPublicMeat / validHouseholds : 0,
          bone: netPublicBone > 0 ? netPublicBone / validHouseholds : 0,
          liver: netPublicLiver > 0 ? netPublicLiver / validHouseholds : 0,
      };

      autoTable(doc, {
          startY: yPos,
          head: [['Metric', 'Value']],
          body: [
              ['Total Households', households],
              ['Meat Deducted', `${meatTakenOut || 0} kg`],
              ['Bone Deducted', `${boneTakenOut || 0} kg`],
              ['Liver Deducted', `${liverTakenOut || 0} kg`],
          ],
          theme: 'striped'
      });

      yPos = (doc as any).lastAutoTable.finalY + 10;

      autoTable(doc, {
          startY: yPos,
          head: [['Net Public Pool', 'Value']],
          body: [
              ['Meat', `${formatWeight(Math.max(0, netPublicMeat))} kg`],
              ['Bone', `${formatWeight(Math.max(0, netPublicBone))} kg`],
              ['Liver', `${formatWeight(Math.max(0, netPublicLiver))} kg`],
          ],
          theme: 'striped',
          headStyles: { fillColor: [66, 135, 245] },
      });
      
      yPos = (doc as any).lastAutoTable.finalY + 10;

      autoTable(doc, {
          startY: yPos,
          head: [['Distribution per Household', 'Value']],
          body: [
              ['Meat', `${formatWeight(perHousehold.meat)} kg`],
              ['Bone', `${formatWeight(perHousehold.bone)} kg`],
              ['Liver', `${formatWeight(perHousehold.liver)} kg`],
          ],
          theme: 'striped',
          headStyles: { fillColor: [66, 135, 245] },
      });
    }

    doc.save("udhiyath_report.pdf");
  };

  return (
    <main className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-4xl mx-auto flex flex-col gap-12">
        <Header />
        <AnimalForm 
          onAddAnimal={handleAddAnimal} 
          animalToEdit={editingAnimal}
          onFormClear={handleClearForm}
        />
        
        {animals.length > 0 && (
          <section className="space-y-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <h2 className="text-3xl font-bold font-headline text-primary">
                Animal Summaries
              </h2>
              <Button onClick={handleDownloadPdf} variant="outline" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            </div>
            <Accordion type="multiple" className="w-full space-y-4">
              {animals.map((animal) => (
                <AnimalCard key={animal.id} animal={animal} onEdit={handleEdit} />
              ))}
            </Accordion>
          </section>
        )}
        
        {animals.length > 0 && 
            <PublicSummaryCard 
                animals={animals} 
                households={households}
                setHouseholds={setHouseholds}
                meatTakenOut={meatTakenOut}
                setMeatTakenOut={setMeatTakenOut}
                boneTakenOut={boneTakenOut}
                setBoneTakenOut={setBoneTakenOut}
                liverTakenOut={liverTakenOut}
                setLiverTakenOut={setLiverTakenOut}
            />
        }
      </div>
    </main>
  );
}
