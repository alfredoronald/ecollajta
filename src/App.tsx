import { useState } from "react";
import { optimizeEcoLlajta } from "./model/optimizer";

export default function App() {
  const [macetas, setMacetas] = useState(20);
  const [workers, setWorkers] = useState(11);

  const [result, setResult] = useState<any>(null);

  // ✅ Modal Error
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // ✅ Modal Configuración
  const [openConfig, setOpenConfig] = useState(false);

  // ✅ Tiempos estándar editables
  const [tiempos, setTiempos] = useState({
    triturado: 1.8,
    medicion: 1.17,
    engrase: 0.25,
    mezcla: 1.32,
    secadoBase: 17,
    desmolde: 0.18,
  });

  function handleCalc() {
    const res = optimizeEcoLlajta(macetas, workers, tiempos);

    if (res.error) {
      setErrorMsg(res.error);
      setResult(null);
    } else {
      setResult(res);
      setErrorMsg(null);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 sm:px-10 py-12">

      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-extrabold text-indigo-700 drop-shadow-sm">
          EcoLlajta 🌱
        </h1>

        <p className="text-gray-600 mt-2 text-lg">
          Asignación de Operarios y Optimización de Producción
        </p>

        {/* ⚙️ Configuración */}
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setOpenConfig(true)}
            className="px-4 py-2 rounded-xl bg-indigo-200 text-indigo-800 font-bold hover:bg-indigo-300 transition"
          >
            ⚙️ Configurar tiempos estándar
          </button>
        </div>
      </div>

      {/* Panel Inputs */}
      <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl max-w-xl mx-auto border border-indigo-100">

        <h2 className="text-xl font-bold text-indigo-700 mb-5 text-center">
          Parámetros de Entrada
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">

          {/* Macetas */}
          <div>
            <label className="font-semibold text-gray-700 block mb-1">
              Número de Macetas
            </label>
            <input
              type="number"
              value={macetas}
              onChange={(e) => setMacetas(+e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-3 py-2"
            />
          </div>

          {/* Operarios */}
          <div>
            <label className="font-semibold text-gray-700 block mb-1">
              Operarios Disponibles
            </label>
            <input
              type="number"
              value={workers}
              onChange={(e) => setWorkers(+e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-3 py-2"
            />
          </div>
        </div>

        {/* Botón */}
        <button
          onClick={handleCalc}
          className="w-full py-3 rounded-xl bg-indigo-600 text-white font-bold text-lg hover:bg-indigo-700 transition shadow-md"
        >
          🚀 Calcular Optimización
        </button>
      </div>

      {/* ✅ Modal Error */}
      {errorMsg && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 text-center">
            <h2 className="text-2xl font-extrabold text-red-600 mb-3">
              ⚠️ Error de Operarios
            </h2>

            <p className="text-gray-700 mb-6">{errorMsg}</p>

            <button
              onClick={() => setErrorMsg(null)}
              className="px-6 py-2 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* ⚙️ Modal Configuración */}
      {openConfig && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6">

            <h2 className="text-2xl font-extrabold text-indigo-700 mb-4 text-center">
              ⚙️ Configuración de Tiempos
            </h2>

            <p className="text-gray-600 text-sm text-center mb-5">
              Cambia los minutos por maceta para cada etapa.
            </p>

            {/* Inputs */}
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(tiempos).map(([key, value]) => (
                <div key={key}>
                  <label className="block font-semibold text-gray-700 capitalize">
                    {key}
                  </label>

                  <input
                    type="number"
                    step="0.01"
                    value={value}
                    onChange={(e) =>
                      setTiempos({
                        ...tiempos,
                        [key]: parseFloat(e.target.value),
                      })
                    }
                    className="w-full rounded-xl border px-3 py-2"
                  />
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex justify-between mt-6">
              <button
                onClick={() => setOpenConfig(false)}
                className="px-6 py-2 rounded-xl bg-gray-300 font-bold hover:bg-gray-400"
              >
                Cancelar
              </button>

              <button
                onClick={() => setOpenConfig(false)}
                className="px-6 py-2 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resultados */}
      {result && (
        <div className="mt-12 max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl p-6 border border-indigo-100">

          {/* Title */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
            <h2 className="text-2xl font-extrabold text-indigo-700">
              📊 Resultados Óptimos
            </h2>

            <span className="mt-3 sm:mt-0 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 font-bold">
              Tiempo Total: {(result.totalTime / 60).toFixed(2)} h{" "}
              <span className="text-gray-500 text-sm">
                ({result.totalTime.toFixed(0)} min)
              </span>
            </span>
          </div>
          {/* 📌 Tabla Materiales */}
<div className="mt-6 bg-gray-50 p-4 rounded-xl shadow">
  <h3 className="text-lg font-bold text-indigo-700 mb-3">
    🧪 Materiales Necesarios
  </h3>

  <table className="w-full text-sm border">
    <thead>
      <tr className="bg-indigo-600 text-white">
        <th className="p-2">Material</th>
        <th className="p-2">Cantidad</th>
      </tr>
    </thead>

    <tbody>
      <tr className="text-center border-t">
        <td className="p-2 font-semibold">🥚 Cáscara de huevo</td>
        <td className="p-2">{result.materiales.cascarasHuevo} kg</td>
      </tr>

      <tr className="text-center border-t">
        <td className="p-2 font-semibold">🌿 Alginato</td>
        <td className="p-2">{result.materiales.alginato} kg</td>
      </tr>

      <tr className="text-center border-t">
        <td className="p-2 font-semibold">💧 Agua</td>
        <td className="p-2">{result.materiales.agua} L</td>
      </tr>

      <tr className="text-center border-t">
        <td className="p-2 font-semibold">🛢 Aceite</td>
        <td className="p-2">{result.materiales.aceite} L</td>
      </tr>
    </tbody>
  </table>
</div>



          {/* Tabla */}
          <div className="overflow-x-auto rounded-xl">
            <table className="w-full text-sm border-collapse">

              <thead>
                <tr className="bg-indigo-600 text-white text-center">
                  <th className="p-3 rounded-tl-xl">Etapa</th>
                  <th className="p-3">Operarios</th>
                  <th className="p-3">Equipo de Trabajo</th>
                  <th className="p-3 rounded-tr-xl">Tiempo</th>
                </tr>
              </thead>

              <tbody>
                {result.resultados.map((r: any, idx: number) => (
                  <tr
                    key={r.etapa}
                    className={`text-center ${
                      idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-indigo-50 transition`}
                  >
                    <td className="p-3 font-bold text-gray-800">
                      {r.etapa}
                    </td>

                    <td className="p-3">
                      <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold">
                        👷 {r.operarios}{" "}
                        <span className="text-gray-500">
                          (mín: {r.minOperarios})
                        </span>
                      </span>
                    </td>

                    <td className="p-3">
                      <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 font-semibold">
                        ⚙️ {r.equipos} {r.equipoNombre}
                      </span>
                    </td>

                    <td className="p-3 font-semibold text-indigo-700">
                      ⏱ {r.tiempo.toFixed(2)} min
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-6 text-center text-gray-600 italic">
            Modelo basado en asignación dinámica de operarios y equipos para minimizar el tiempo total.
          </p>
        </div>
        
      )}

      
    </div>
  );
}
