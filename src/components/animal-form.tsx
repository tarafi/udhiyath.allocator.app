"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PlusCircle, Trash2, Beef, Bone, Heart } from "lucide-react";
import type { CalculatedAnimalData } from "@/lib/types";

const formSchema = z.object({
  animalId: z.string().min(1, { message: "Animal ID is required." }),
  meatWeights: z.array(z.object({ value: z.coerce.number().positive({ message: "Must be > 0" }) })),
  boneWeights: z.array(z.object({ value: z.coerce.number().positive({ message: "Must be > 0" }) })),
  liverWeights: z.array(z.object({ value: z.coerce.number().positive({ message: "Must be > 0" }) })),
});

type AnimalFormValues = z.infer<typeof formSchema>;

interface AnimalFormProps {
  onAddAnimal: (animal: CalculatedAnimalData) => void;
}

const WeightInputSection = ({ control, name, label, Icon }: { control: any, name: "meatWeights" | "boneWeights" | "liverWeights", label: string, Icon: React.ElementType }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Icon className="h-6 w-6 text-primary" />
        <h3 className="text-lg font-semibold">{label}</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {fields.map((field, index) => (
          <FormField
            key={field.id}
            control={control}
            name={`${name}.${index}.value`}
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormControl>
                    <Input type="number" placeholder={`Weight ${index + 1} (kg)`} {...field} />
                  </FormControl>
                  <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} aria-label={`Remove ${label} weight ${index + 1}`}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
      </div>
      <Button type="button" variant="outline" size="sm" onClick={() => append({ value: 0 })}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Add {label} Weight
      </Button>
    </div>
  );
};

export function AnimalForm({ onAddAnimal }: AnimalFormProps) {
  const form = useForm<AnimalFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      animalId: "",
      meatWeights: [{ value: 0 }],
      boneWeights: [{ value: 0 }],
      liverWeights: [{ value: 0 }],
    },
  });

  function onSubmit(data: AnimalFormValues) {
    const meatTotal = data.meatWeights.reduce((sum, item) => sum + item.value, 0);
    const boneTotal = data.boneWeights.reduce((sum, item) => sum + item.value, 0);
    const liverTotal = data.liverWeights.reduce((sum, item) => sum + item.value, 0);

    const calculatedData: CalculatedAnimalData = {
      id: data.animalId.toUpperCase(),
      meatWeights: data.meatWeights.map(w => w.value),
      boneWeights: data.boneWeights.map(w => w.value),
      liverWeights: data.liverWeights.map(w => w.value),
      totals: {
        meat: meatTotal,
        bone: boneTotal,
        liver: liverTotal,
        all: meatTotal + boneTotal + liverTotal,
      },
      shares: {
        owner: {
          meat: meatTotal / 3,
          bone: boneTotal / 3,
          liver: liverTotal / 3,
          total: (meatTotal + boneTotal + liverTotal) / 3,
        },
        public: {
          meat: meatTotal * (2 / 3),
          bone: boneTotal * (2 / 3),
          liver: liverTotal * (2 / 3),
          total: (meatTotal + boneTotal + liverTotal) * (2 / 3),
        },
      },
    };
    onAddAnimal(calculatedData);
    form.reset({
      animalId: "",
      meatWeights: [{ value: 0 }],
      boneWeights: [{ value: 0 }],
      liverWeights: [{ value: 0 }],
    });
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">Enter Animal Weights</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-8">
            <FormField
              control={form.control}
              name="animalId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Animal ID</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., B1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Separator />
            <WeightInputSection control={form.control} name="meatWeights" label="Meat" Icon={Beef} />
            <Separator />
            <WeightInputSection control={form.control} name="boneWeights" label="Bone" Icon={Bone} />
            <Separator />
            <WeightInputSection control={form.control} name="liverWeights" label="Liver" Icon={Heart} />
          </CardContent>
          <CardFooter>
            <Button type="submit" size="lg" className="w-full sm:w-auto bg-accent hover:bg-accent/90">
              <PlusCircle className="mr-2 h-5 w-5" />
              Add / Update Animal Data
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
