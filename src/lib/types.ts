export interface AnimalData {
  id: string; // e.g., "B1"
  meatWeights: number[];
  boneWeights: number[];
  liverWeights: number[];
  shareholders: number;
}

export interface CalculatedAnimalData extends AnimalData {
  totals: {
    meat: number;
    bone: number;
    liver: number;
    all: number;
  };
  shares: {
    owner: {
      meat: number;
      bone: number;
      liver: number;
      total: number;
    };
    public: {
      meat: number;
      bone: number;
      liver: number;
      total: number;
    };
  };
}
