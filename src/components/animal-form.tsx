"use client";

import { useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  animalId: z.string().min(1, { message: "Animal ID is required." }),
  meatWeights: z.array(z.object({ value: z.coerce.number().gt(0, { message: "Must be > 0" }) })),
  boneWeights: z.array(z.object({ value: z.coerce.number().gt(0, { message: "Must be > 0" }) })),
  liverWeights: z.array(z.object({ value: z.coerce.number().gt(0, { message: "Must be > 0" }) })),
});

type AnimalFormValues = z.infer<typeof formSchema>;

interface AnimalFormProps {
  onAddAnimal: (animal: CalculatedAnimalData) => void;
  animalToEdit: CalculatedAnimalData | null;
  onFormClear: () => void;
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
                    <Input 
                      type="number"
                      placeholder="Weight (kg)" 
                      {...field}
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.value === '' ? undefined : parseFloat(e.target.value))}
                    />
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
      <Button type="button" variant="outline" size="sm" onClick={() => append({ value: undefined })}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Add {label} Weight
      </Button>
    </div>
  );
};

export function AnimalForm({ onAddAnimal, animalToEdit, onFormClear }: AnimalFormProps) {
  const form = useForm<AnimalFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      animalId: "",
      meatWeights: [],
      boneWeights: [],
      liverWeights: [],
    },
  });

  useEffect(() => {
    const mapWeights = (weights: number[]) => {
      const mapped = weights.filter(w => w > 0).map(value => ({ value }));
      return mapped.length > 0 ? mapped : [{ value: undefined }];
    };

    if (animalToEdit) {
      form.reset({
        animalId: animalToEdit.id,
        meatWeights: mapWeights(animalToEdit.meatWeights),
        boneWeights: mapWeights(animalToEdit.boneWeights),
        liverWeights: mapWeights(animalToEdit.liverWeights),
      });
    } else {
      form.reset({
        animalId: "",
        meatWeights: [{ value: undefined }],
        boneWeights: [{ value: undefined }],
        liverWeights: [{ value: undefined }],
      });
    }
  }, [animalToEdit, form.reset]);

  function onSubmit(data: AnimalFormValues) {
    const meatTotal = data.meatWeights.reduce((sum, item) => sum + (item.value || 0), 0);
    const boneTotal = data.boneWeights.reduce((sum, item) => sum + (item.value || 0), 0);
    const liverTotal = data.liverWeights.reduce((sum, item) => sum + (item.value || 0), 0);

    const calculatedData: CalculatedAnimalData = {
      id: data.animalId.toUpperCase(),
      meatWeights: data.meatWeights.map(w => w.value || 0),
      boneWeights: data.boneWeights.map(w => w.value || 0),
      liverWeights: data.liverWeights.map(w => w.value || 0),
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
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">
          {animalToEdit ? `Editing Animal: ${animalToEdit.id}` : 'Enter Animal Weights'}
        </CardTitle>
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
                   <Select onValueChange={field.onChange} value={field.value} disabled={!!animalToEdit}>
                    <FormControl>
                      <SelectTrigger disabled={!!animalToEdit}>
                        <SelectValue placeholder="Select an animal ID" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Array.from({ length: 10 }, (_, i) => `B${i + 1}`).map((id) => (
                        <SelectItem key={id} value={id}>
                          <span role="img" aria-label="buffalo" className="mr-2">🐃</span> {id}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
          <CardFooter className="flex items-center justify-between">
            <Button type="submit" size="lg" className="sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
              <PlusCircle className="mr-2 h-5 w-5" />
              {animalToEdit ? 'Update Animal Data' : 'Add Animal Data'}
            </Button>
            {animalToEdit && (
               <Button type="button" variant="outline" onClick={onFormClear}>
                 Cancel Edit
               </Button>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
