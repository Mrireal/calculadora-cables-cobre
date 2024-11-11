import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  resultado: {
    pesoCable: number | null;
    pesosNudo: { porcentaje: number; peso: number; precio: number }[];
    precioCable: number | null;
    area: number | null;
    volumenCable: number | null;
    volumenNudo: number | null;
  };
  datosCable: {
    diametro: number;
    radio: number;
  };
  mostrarExplicacion: boolean;
  setMostrarExplicacion: (mostrar: boolean) => void;
  mostrarSoloCable: boolean;
}

function CalculatorResults({ resultado, datosCable, mostrarExplicacion, setMostrarExplicacion, mostrarSoloCable }: Props) {
  if (mostrarSoloCable) {
    if (!resultado.pesoCable) return null;

    return (
      <div className="space-y-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-green-800 mb-2">Cable Entre Postes:</h3>
          <p className="text-green-700">
            Contiene <span className="font-bold">{resultado.pesoCable}</span> kg de cobre
          </p>
          <p className="text-green-700">
            Valor aproximado: <span className="font-bold">${resultado.precioCable?.toLocaleString('es-CL')} CLP</span>
          </p>
        </div>
      </div>
    );
  }

  if (resultado.pesosNudo.length === 0) return null;

  return (
    <div className="space-y-4">
      {resultado.pesosNudo.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Nudo de Cable:</h3>
          <div className="space-y-3">
            {resultado.pesosNudo.map(({ porcentaje, peso, precio }) => (
              <div key={porcentaje} className="border-b border-blue-200 pb-2 last:border-0 last:pb-0">
                <p className="text-blue-700 font-medium">
                  Para {porcentaje}% de densidad:
                </p>
                <p className="text-blue-700 ml-4">
                  • Contiene <span className="font-bold">{peso}</span> kg de cobre
                </p>
                <p className="text-blue-700 ml-4">
                  • Valor aproximado: <span className="font-bold">${precio.toLocaleString('es-CL')} CLP</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={() => setMostrarExplicacion(!mostrarExplicacion)}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors w-full justify-center"
      >
        {mostrarExplicacion ? (
          <>
            <ChevronUp className="w-4 h-4" />
            Ocultar explicación
          </>
        ) : (
          <>
            <ChevronDown className="w-4 h-4" />
            Ver cómo se calculó
          </>
        )}
      </button>

      {mostrarExplicacion && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-700">
          {resultado.volumenNudo && (
            <>
              <h4 className="font-semibold mb-2">Cálculo para Nudo:</h4>
              <ol className="list-decimal pl-4 space-y-1">
                <li>Radio de la esfera: {datosCable.radio} cm</li>
                <li>Volumen total de la esfera: {resultado.volumenNudo} cm³</li>
                <li>Para cada porcentaje (2.5%, 5%, 10%):</li>
                <li className="ml-4">Volumen de cobre = Volumen total × Porcentaje</li>
                <li className="ml-4">Peso = Volumen de cobre × 8.96 g/cm³</li>
              </ol>
            </>
          )}

          <p className="mt-4 text-xs text-gray-500">
            Nota: Los cálculos consideran la densidad del cobre puro (8.96 g/cm³). Los resultados son aproximados
            y pueden variar según el tipo específico de cable y su composición exacta.
          </p>
        </div>
      )}
    </div>
  );
}

export default CalculatorResults;