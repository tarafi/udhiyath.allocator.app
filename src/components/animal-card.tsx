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

interface AnimalCardProps {
  animal: CalculatedAnimalData;
}

const formatWeight = (weight: number) => weight.toFixed(2);

export function AnimalCard({ animal }: AnimalCardProps) {
  return (
    <Card className="shadow-md">
      <AccordionItem value={animal.id} className="border-b-0">
        <AccordionTrigger className="p-4 text-xl font-bold font-headline hover:no-underline">
          Animal: {animal.id}
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
