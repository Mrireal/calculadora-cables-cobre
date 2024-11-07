import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  resultado: {
    pesoCable: number | null;
    pesoNudo: number | null;
    precioCable: number | null;
    precioNudo: number | null;
    area: number | null;
    volumenCable: number | null;
    volumenNudo: number | null;
  };
  datosCable: {
    diametro: number;
    diametroNudo: number;
  };
  mostrarExplicacion: boolean;
  setMostrarExplicacion: (mostrar: boolean) => void;
}

function CalculatorResults({ resultado, datosCable, mostrarExplicacion, setMostrarExplicacion }: Props) {
  if (!resultado.pesoCable) return null;

  return (
    <div className="space-y-4">
      {resultado.pesoCable > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-green-800 mb-2">Cable Entre Postes:</h3>
          <p className="text-green-700">
            Contiene <span className="font-bold">{resultado.pesoCable}</span> kg de cobre
          </p>
          <p className="text-green-700">
            Valor aproximado: <span className="font-bold">${resultado.precioCable?.toLocaleString('es-CL')} CLP</span>
          </p>
        </div>
      )}
      
      {resultado.pesoNudo > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Nudo de Cable:</h3>
          <p className="text-blue-700">
            Contiene <span className="font-bold">{resultado.pesoNudo}</span> kg de cobre
          </p>
          <p className="text-blue-700">
            Valor aproximado: <span className="font-bold">${resultado.precioNudo?.toLocaleString('es-CL')} CLP</span>
          </p>
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
          <h4 className="font-semibold mb-2">Cálculo para Cable Entre Postes:</h4>
          <ol className="list-decimal pl-4 space-y-1">
            <li>Radio del cable: {datosCable.diametro/2} mm</li>
            <li>Área de la sección: {resultado.area} mm²</li>
            <li>Volumen del cable: {resultado.volumenCable} mm³</li>
            <li>Peso = Volumen × Densidad del cobre (8.96 g/cm³)</li>
          </ol>

          {resultado.pesoNudo > 0 && (
            <>
              <h4 className="font-semibold mt-4 mb-2">Cálculo para Nudo:</h4>
              <ol className="list-decimal pl-4 space-y-1">
                <li>Radio del nudo: {(datosCable.diametroNudo * 100 / 2).toFixed(1)} cm</li>
                <li>Volumen de la esfera: {resultado.volumenNudo} mm³</li>
                <li>Peso = Volumen × Densidad del cobre (8.96 g/cm³)</li>
              </ol>
            </>
          )}

          <p className="mt-4 text-xs text-gray-500">
            Nota: Los cálculos consideran la densidad del cobre puro. Los resultados son aproximados
            y pueden variar según el tipo específico de cable y su composición exacta.
          </p>
        </div>
      )}
    </div>
  );
}

export default CalculatorResults;