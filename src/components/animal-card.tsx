"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import type { CalculatedAnimalData } from "@/lib/types";
import {
  AccordionContent,
  AccordionItem,
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
import { ChevronDown, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnimalCardProps {
  animal: CalculatedAnimalData;
  onEdit: (animalId: string) => void;
}

const formatWeight = (weight: number) => weight.toFixed(2);

export function AnimalCard({ animal, onEdit }: AnimalCardProps) {
  return (
    <Card className="shadow-md">
      <AccordionItem value={animal.id} className="border-b-0">
        <AccordionPrimitive.Header className="flex w-full items-center">
          <AccordionPrimitive.Trigger
            className={cn(
              "flex flex-1 items-center justify-between p-4 text-xl font-bold font-headline transition-all hover:no-underline [&[data-state=open]>svg]:rotate-180"
            )}
          >
            <span>Animal: {animal.id}</span>
            <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
          </AccordionPrimitive.Trigger>
          <div className="pr-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(animal.id)}
              className="text-sm font-medium"
              aria-label={`Edit ${animal.id}`}
            >
              <Pencil className="h-4 w-4" />
              <span>Edit</span>
            </Button>
          </div>
        </AccordionPrimitive.Header>
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
