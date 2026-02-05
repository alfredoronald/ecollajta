import { Stage } from "./types";


export const STAGES: Stage[] = [
{ name: "Desmolde", minWorkers: 2, timePerUnit: 0.18 },
{ name: "Secado", minWorkers: 0, timePerUnit: 17, special: "SECADO" },
{ name: "Mezcla–Vaciado", minWorkers: 2, timePerUnit: 1.32, special: "MIX" },
{ name: "Engrase", minWorkers: 1, timePerUnit: 0.25 },
{ name: "Medición", minWorkers: 2, timePerUnit: 1.17 },
{ name: "Triturado", minWorkers: 2, timePerUnit: 36, special: "TRITURADO" },
];