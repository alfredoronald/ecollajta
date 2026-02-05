export type Stage = {
name: string;
minWorkers: number;
timePerUnit: number;
special?: "TRITURADO" | "SECADO" | "MIX";
};


export type OptimizationResult = {
allocation: Record<string, number>;
times: Record<string, number>;
totalTime: number;
};