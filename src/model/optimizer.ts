export function optimizeEcoLlajta(macetas: number, totalWorkers: number) {

  // Etapas con fórmula real
  let stages = [
  {
    name: "Triturado",
    baseTime: macetas * 1.8,
    minWorkers: 2,
    workersPerEquip: 2,
    equip: 1,
    equipName: "Molino",
  },
  {
    name: "Medición",
    baseTime: macetas * 1.17,
    minWorkers: 2,
    workersPerEquip: 2,
    equip: 1,
    equipName: "Balanza",
  },
  {
    name: "Engrase",
    baseTime: macetas * 0.25,
    minWorkers: 1,
    workersPerEquip: 1,
    equip: 1,
    equipName: "Molde",
  },
  {
    name: "Mezcla–Vaciado",
    baseTime: macetas * 1.32,
    minWorkers: 4,
    workersPerEquip: 2,
    equip: 2,
    equipName: "Bowl",
  },
  {
    name: "Secado",
    baseTime: 17 + (macetas - 1),
    minWorkers: 0,
    workersPerEquip: 0,
    equip: 0,
    equipName: "Ninguno",
    fixed: true,
  },
  {
    name: "Desmolde",
    baseTime: macetas * 0.18,
    minWorkers: 2,
    workersPerEquip: 2,
    equip: 1,
    equipName: "Molde con mescla",
  },
];


  // ---- Tiempo real por etapa ----
  function stageTime(stage: any) {
    if (stage.fixed) return stage.baseTime;

    if (stage.equip <= 0) return stage.baseTime;

    return stage.baseTime / stage.equip;
  }

  // ---- Asignación mínima ----
  let allocation: Record<string, number> = {};
  let used = 0;

  stages.forEach((s) => {
    allocation[s.name] = s.minWorkers;
    used += s.minWorkers;
  });

  let remaining = totalWorkers - used;

  // ---- Optimización iterativa ----
  while (remaining > 0) {

    // Ignorar secado porque es fijo
    let candidates = stages.filter((s) => !s.fixed);

    // Buscar cuello de botella actual
    let bottleneck = candidates.reduce((a, b) =>
      stageTime(a) > stageTime(b) ? a : b
    );

    // Cuántos operarios cuesta abrir un equipo más
    let needed = bottleneck.workersPerEquip;

    if (needed === 0) break;

    if (remaining >= needed) {
      // aumentar equipo
      bottleneck.equip += 1;

      // asignar operarios para operarlo
      allocation[bottleneck.name] += needed;

      remaining -= needed;
    } else {
      break;
    }
  }

  // ---- Resultados finales ----
  const resultados = stages.map((s) => ({
  etapa: s.name,
  operarios: allocation[s.name],
  equipoNombre: s.equipName,
  equipos: s.equip,
  tiempo: Number(stageTime(s).toFixed(2)),
}));


  const totalTime = resultados.reduce((sum, r) => sum + r.tiempo, 0);

  return {
    resultados,
    totalTime: Number(totalTime.toFixed(2)),
    sobrantes: remaining,
  };
}
