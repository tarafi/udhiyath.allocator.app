"use client";

import { useState, useMemo } from "react";
import type { CalculatedAnimalData } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Beef, Bone, Heart } from "lucide-react";

interface PublicSummaryCardProps {
  animals: CalculatedAnimalData[];
}

export function PublicSummaryCard({ animals }: PublicSummaryCardProps) {
  const [households, setHouseholds] = useState(130);

  const totals = useMemo(() => {
    const totalPublicMeat = animals.reduce((sum, a) => sum + a.shares.public.meat, 0);
    const totalPublicBone = animals.reduce((sum, a) => sum + a.shares.public.bone, 0);
    const totalPublicLiver = animals.reduce((sum, a) => sum + a.shares.public.liver, 0);
    return {
      meat: totalPublicMeat,
      bone: totalPublicBone,
      liver: totalPublicLiver,
    };
  }, [animals]);
  
  const perHousehold = useMemo(() => {
    const validHouseholds = households > 0 ? households : 1;
    return {
        meat: totals.meat / validHouseholds,
        bone: totals.bone / validHouseholds,
        liver: totals.liver / validHouseholds,
    }
  }, [totals, households]);

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-headline text-center">Public Distribution Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
          <div className="space-y-2">
            <Label htmlFor="households" className="text-base">Total Number of Households</Label>
            <Input
              id="households"
              type="number"
              value={households}
              onChange={(e) => setHouseholds(parseInt(e.target.value, 10) || 0)}
              className="max-w-xs"
            />
          </div>
          <div className="space-y-4 rounded-lg bg-muted/50 p-4">
            <h4 className="font-semibold text-center text-lg">Distribution per Household</h4>
            <div className="flex justify-around items-center text-center">
              <div className="flex flex-col items-center gap-1">
                 <Beef className="h-7 w-7 text-primary"/>
                 <span className="font-bold text-lg">{perHousehold.meat.toFixed(2)} kg</span>
                 <span className="text-sm text-muted-foreground">Meat</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                 <Bone className="h-7 w-7 text-primary"/>
                 <span className="font-bold text-lg">{perHousehold.bone.toFixed(2)} kg</span>
                 <span className="text-sm text-muted-foreground">Bone</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                 <Heart className="h-7 w-7 text-primary"/>
                 <span className="font-bold text-lg">{perHousehold.liver.toFixed(2)} kg</span>
                 <span className="text-sm text-muted-foreground">Liver</span>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-4 pt-4 border-t">
          <h4 className="font-semibold text-center text-lg">Total Public Pool</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-medium">Meat</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{totals.meat.toFixed(2)} kg</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-medium">Bone</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{totals.bone.toFixed(2)} kg</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-medium">Liver</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{totals.liver.toFixed(2)} kg</p>
                    </CardContent>
                </Card>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
