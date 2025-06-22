"use client";

import type { CalculatedAnimalData } from "@/lib/types";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

interface AnimalCardProps {
  animal: CalculatedAnimalData;
  onEdit: (animalId: string) => void;
}

const formatWeight = (weight: number) => weight.toFixed(2);

export function AnimalCard({ animal, onEdit }: AnimalCardProps) {
  return (
    <Card className="shadow-md">
      <AccordionItem value={animal.id} className="border-b-0">
        <AccordionTrigger className="p-4 text-xl font-bold font-headline hover:no-underline">
          <div className="flex items-center gap-4">
            <span>Animal: {animal.id}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(animal.id);
              }}
              className="text-sm font-medium"
              aria-label={`Edit ${animal.id}`}
            >
              <Pencil className="h-4 w-4" />
              <span>Edit</span>
            </Button>
          </div>
        </AccordionTrigger>
        <AccordionContent className="p-4 pt-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Owners Share</TableHead>
                <TableHead className="text-right">Public Share</TableHead>
                <TableHead className="text-right">Total Weight</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Meat</TableCell>
                <TableCell className="text-right">{formatWeight(animal.shares.owner.meat)} kg</TableCell>
                <TableCell className="text-right">{formatWeight(animal.shares.public.meat)} kg</TableCell>
                <TableCell className="text-right">{formatWeight(animal.totals.meat)} kg</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Bone</TableCell>
                <TableCell className="text-right">{formatWeight(animal.shares.owner.bone)} kg</TableCell>
                <TableCell className="text-right">{formatWeight(animal.shares.public.bone)} kg</TableCell>
                <TableCell className="text-right">{formatWeight(animal.totals.bone)} kg</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Liver</TableCell>
                <TableCell className="text-right">{formatWeight(animal.shares.owner.liver)} kg</TableCell>
                <TableCell className="text-right">{formatWeight(animal.shares.public.liver)} kg</TableCell>
                <TableCell className="text-right">{formatWeight(animal.totals.liver)} kg</TableCell>
              </TableRow>
              <TableRow className="font-bold bg-muted/50">
                <TableCell>TOTAL</TableCell>
                <TableCell className="text-right">{formatWeight(animal.shares.owner.total)} kg</TableCell>
                <TableCell className="text-right">{formatWeight(animal.shares.public.total)} kg</TableCell>
                <TableCell className="text-right">{formatWeight(animal.totals.all)} kg</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </AccordionContent>
      </AccordionItem>
    </Card>
  );
}
