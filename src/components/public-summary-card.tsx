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
  const [households, setHouseholds] = useState("130");
  const [meatTakenOut, setMeatTakenOut] = useState("");
  const [boneTakenOut, setBoneTakenOut] = useState("");
  const [liverTakenOut, setLiverTakenOut] = useState("");

  const totals = useMemo(() => {
    const totalPublicMeat = animals.reduce((sum, a) => sum + a.shares.public.meat, 0);
    const totalPublicBone = animals.reduce((sum, a) => sum + a.shares.public.bone, 0);
    const totalPublicLiver = animals.reduce((sum, a) => sum + a.shares.public.liver, 0);
    
    return {
      meat: totalPublicMeat - (parseFloat(meatTakenOut) || 0),
      bone: totalPublicBone - (parseFloat(boneTakenOut) || 0),
      liver: totalPublicLiver - (parseFloat(liverTakenOut) || 0),
    };
  }, [animals, meatTakenOut, boneTakenOut, liverTakenOut]);
  
  const perHousehold = useMemo(() => {
    const validHouseholds = parseInt(households, 10) > 0 ? parseInt(households, 10) : 1;
    return {
        meat: totals.meat > 0 ? totals.meat / validHouseholds : 0,
        bone: totals.bone > 0 ? totals.bone / validHouseholds : 0,
        liver: totals.liver > 0 ? totals.liver / validHouseholds : 0,
    }
  }, [totals, households]);

  const displayTotals = {
      meat: Math.max(0, totals.meat),
      bone: Math.max(0, totals.bone),
      liver: Math.max(0, totals.liver),
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-headline text-center">Public Distribution Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="space-y-4">
                <div>
                    <Label htmlFor="households" className="text-base">Total Number of Households</Label>
                    <Input
                      id="households"
                      type="number"
                      value={households}
                      onChange={(e) => setHouseholds(e.target.value)}
                      className="max-w-xs mt-1"
                      placeholder="e.g. 130"
                    />
                </div>
                <div className="space-y-2 pt-4 border-t">
                    <h4 className="font-medium">Pre-distribution Deductions (kg)</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-2">
                        <div>
                            <Label htmlFor="meat-taken-out">Meat</Label>
                            <Input
                                id="meat-taken-out"
                                type="number"
                                value={meatTakenOut}
                                onChange={(e) => setMeatTakenOut(e.target.value)}
                                placeholder="0"
                            />
                        </div>
                        <div>
                            <Label htmlFor="bone-taken-out">Bone</Label>
                            <Input
                                id="bone-taken-out"
                                type="number"
                                value={boneTakenOut}
                                onChange={(e) => setBoneTakenOut(e.target.value)}
                                placeholder="0"
                            />
                        </div>
                        <div>
                            <Label htmlFor="liver-taken-out">Liver</Label>
                            <Input
                                id="liver-taken-out"
                                type="number"
                                value={liverTakenOut}
                                onChange={(e) => setLiverTakenOut(e.target.value)}
                                placeholder="0"
                            />
                        </div>
                    </div>
                </div>
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
          <h4 className="font-semibold text-center text-lg">Net Public Pool (After Deductions)</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-medium">Meat</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{displayTotals.meat.toFixed(2)} kg</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-medium">Bone</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{displayTotals.bone.toFixed(2)} kg</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-medium">Liver</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{displayTotals.liver.toFixed(2)} kg</p>
                    </CardContent>
                </Card>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
