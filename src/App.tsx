import { useState } from "react";
import { optimizeEcoLlajta } from "./model/optimizer";

export default function App() {
  const [macetas, setMacetas] = useState(20);
  const [workers, setWorkers] = useState(11);

  const [result, setResult] = useState<any>(null);

  // ✅ Modal Error
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  function handleCalc() {
    const res = optimizeEcoLlajta(macetas, workers);

    if (res.error) {
      setErrorMsg(res.error); // ✅ abrir modal
      setResult(null);
    } else {
      setResult(res);
      setErrorMsg(null);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 sm:px-10 py-12">

      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-indigo-700 drop-shadow-sm">
          EcoLlajta 🌱
        </h1>
        <p className="text-gray-600 mt-2 text-lg">
          Asignación de Operarios y Optimización de Producción
        </p>
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
              className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
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
              className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
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

            <p className="text-gray-700 mb-6">
              {errorMsg}
            </p>

            <button
              onClick={() => setErrorMsg(null)}
              className="px-6 py-2 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition"
            >
              Entendido
            </button>
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
              Tiempo Total: {result.totalTime.toFixed(2)} min
            </span>
          </div>

          {/* Tabla */}
          <div className="overflow-x-auto rounded-xl">
            <table className="w-full text-sm border-collapse">

              <thead>
                <tr className="bg-indigo-600 text-white text-center">
                  <th className="p-3 rounded-tl-xl">Etapa</th>
                  <th className="p-3">Operarios</th>
                  <th className="p-3">Equipos</th>
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
                        👷 {r.operarios}
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
