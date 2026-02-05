export function optimizeEcoLlajta(macetas: number, totalWorkers: number) {

  // ✅ Restricción mínima real del modelo
  if (totalWorkers < 9) {
    return {
      error: "❌ No se puede optimizar con menos de 9 operarios disponibles.",
      resultados: [],
      totalTime: 0,
      sobrantes: 0,
    };
  }

  // Etapas base del proceso
  let stages = [
    {
      name: "Triturado",
      baseTime: 36,
      minWorkers: 2,
      workersPerEquip: 2,
      equip: 1,
      equipoNombre: "Molino",
    },
    {
      name: "Medición",
      baseTime: macetas * 1.17,
      minWorkers: 2,
      workersPerEquip: 2,
      equip: 1,
      equipoNombre: "Balanza",
    },
    {
      name: "Engrase",
      baseTime: macetas * 0.25,
      minWorkers: 1,
      workersPerEquip: 1,
      equip: 1,
      equipoNombre: "Molde",
    },
    {
      name: "Mezcla–Vaciado",
      baseTime: macetas * 1.32,
      minWorkers: 2,
      workersPerEquip: 2,
      equip: 1,
      equipoNombre: "Bowl",
    },
    {
      name: "Secado",
      baseTime: 17 + (macetas - 1),
      minWorkers: 0,
      workersPerEquip: 0,
      equip: 0,
      equipoNombre: "—",
      fixed: true,
    },
    {
      name: "Desmolde",
      baseTime: macetas * 0.18,
      minWorkers: 2,
      workersPerEquip: 2,
      equip: 1,
      equipoNombre: "Mesa",
    },
  ];

  // ---- Tiempo real ----
  function stageTime(stage: any) {
    if (stage.fixed) return stage.baseTime;
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

    let candidates = stages.filter((s) => !s.fixed);

    // cuello de botella
    let bottleneck = candidates.reduce((a, b) =>
      stageTime(a) > stageTime(b) ? a : b
    );

    let needed = bottleneck.workersPerEquip;

    if (remaining >= needed) {
      bottleneck.equip += 1;
      allocation[bottleneck.name] += needed;
      remaining -= needed;
    } else {
      break;
    }
  }

  // ---- Resultados ----
  const resultados = stages.map((s) => ({
    etapa: s.name,
    operarios: allocation[s.name],
    equipos: s.equip,
    equipoNombre: s.equipoNombre,
    tiempo: Number(stageTime(s).toFixed(2)),
  }));

  const totalTime = resultados.reduce((sum, r) => sum + r.tiempo, 0);

  return {
    error: null,
    resultados,
    totalTime: Number(totalTime.toFixed(2)),
    sobrantes: remaining,
  };
}
