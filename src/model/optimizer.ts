export function optimizeEcoLlajta(
  macetas: number,
  totalWorkers: number,
  times: any,
  moldesMaximos: number = 40
) {
  // ==============================
  // ✅ Validación mínima
  // ==============================
  if (totalWorkers < 9) {
    return {
      error: "❌ No se puede optimizar con menos de 9 operarios disponibles.",
      resultados: [],
      totalTime: 0,
      sobrantes: 0,
      moldesNecesarios: 0,
      materiales: null,
    };
  }

  // ==============================
  // ✅ Valores seguros
  // ==============================
  const safeTimes = {
    triturado: times?.triturado ?? 1.8,
    medicion: times?.medicion ?? 1.17,
    engrase: times?.engrase ?? 0.25,
    mezcla: times?.mezcla ?? 1.32,
    secado: times?.secado ?? 35,
    desmolde: times?.desmolde ?? 0.18,
  };

  // ==============================
  // ✅ Moldes iniciales mínimos
  // ==============================
  let moldes = Math.min(macetas, 5); // arranca con pocos moldes

  // ==============================
  // Etapas del proceso
  // ==============================
  let stages = [
    {
      name: "Triturado",
      baseTime: safeTimes.triturado * macetas,
      minWorkers: 2,
      workersPerEquip: 2,
      equip: 1,
      equipoNombre: "Molino",
    },
    {
      name: "Medición",
      baseTime: safeTimes.medicion * macetas,
      minWorkers: 2,
      workersPerEquip: 2,
      equip: 1,
      equipoNombre: "Balanza",
    },
    {
      name: "Engrase",
      baseTime: safeTimes.engrase * macetas,
      minWorkers: 1,
      workersPerEquip: 1,
      equip: moldes,
      equipoNombre: "Moldes",
    },
    {
      name: "Mezcla–Vaciado",
      baseTime: safeTimes.mezcla * macetas,
      minWorkers: 2,
      workersPerEquip: 2,
      equip: 1,
      equipoNombre: "Bowl",
    },
    {
      name: "Secado",
      baseTime: 0, // se calcula dinámico
      minWorkers: 0,
      workersPerEquip: 0,
      equip: moldes,
      equipoNombre: "Moldes ocupados",
      fixed: true,
    },
    {
      name: "Desmolde",
      baseTime: safeTimes.desmolde * macetas,
      minWorkers: 2,
      workersPerEquip: 2,
      equip: 1,
      equipoNombre: "Mesa",
    },
  ];

  // ==============================
  // Tiempo real por etapa
  // ==============================
  function stageTime(stage: any) {
    if (stage.name === "Secado") {
      const ciclos = Math.ceil(macetas / moldes);
      return ciclos * safeTimes.secado;
    }

    if (stage.fixed) return stage.baseTime;
    return stage.baseTime / stage.equip;
  }

  // ==============================
  // Asignación mínima inicial
  // ==============================
  let allocation: Record<string, number> = {};
  let used = 0;

  stages.forEach((s) => {
    allocation[s.name] = s.minWorkers;
    used += s.minWorkers;
  });

  let remaining = totalWorkers - used;

  // ==============================
  // 🔥 Optimización iterativa
  // ==============================
  while (remaining > 0) {
    let candidates = stages.filter((s) => !s.fixed);

    // Cuello de botella actual
    let bottleneck = candidates.reduce((a, b) =>
      stageTime(a) > stageTime(b) ? a : b
    );

    // ============================
    // ✅ Opción especial: agregar moldes
    // ============================
    if (moldes < moldesMaximos && remaining >= 1) {
      // Si secado es más lento que mezcla, conviene moldes
      const secadoTime = stageTime({ name: "Secado" });
      const mezclaTime = stageTime(
        stages.find((x) => x.name === "Mezcla–Vaciado")
      );

      if (secadoTime > mezclaTime) {
        moldes += 1;
        remaining -= 1;

        // actualizar engrase y secado
        stages.find((x) => x.name === "Engrase")!.equip = moldes;
        stages.find((x) => x.name === "Secado")!.equip = moldes;

        continue;
      }
    }

    // ============================
    // Optimización normal
    // ============================
    let needed = bottleneck.workersPerEquip;

    if (remaining >= needed) {
      bottleneck.equip += 1;
      allocation[bottleneck.name] += needed;
      remaining -= needed;
    } else break;
  }

  // ==============================
  // Materiales necesarios
  // ==============================
  const materiales = {
    cascarasHuevo: Number((macetas * 0.175).toFixed(2)),
    alginato: Number((macetas * 0.018).toFixed(2)),
    agua: Number((macetas * 0.14).toFixed(2)),
    aceite: Number((macetas * 0.01).toFixed(2)),
  };

  // ==============================
  // Resultados finales
  // ==============================
  const resultados = stages.map((s) => ({
    etapa: s.name,
    operarios: allocation[s.name],
    minOperarios: s.minWorkers,
    equipos: s.name === "Secado" || s.name === "Engrase" ? moldes : s.equip,
    equipoNombre: s.equipoNombre,
    tiempo: Number(stageTime(s).toFixed(2)),
  }));

  const totalTime = resultados.reduce((sum, r) => sum + r.tiempo, 0);

  return {
    error: null,
    resultados,
    totalTime: Number(totalTime.toFixed(2)),
    sobrantes: remaining,
    moldesNecesarios: moldes,
    materiales,
  };
}
