import React from 'react';
import { Cable, CircleDot, Calculator } from 'lucide-react';

interface Props {
  datosCable: {
    diametro: number;
    longitud: number;
    radio: number;
  };
  setDatosCable: (datos: any) => void;
  onCalcularCable: () => void;
  onCalcularNudo: () => void;
  resultadoCable: {
    pesoCable: number | null;
    precioCable: number | null;
  } | null;
  mostrarExplicacionCable: boolean;
  setMostrarExplicacionCable: (mostrar: boolean) => void;
}

function CalculatorInputs({ 
  datosCable, 
  setDatosCable, 
  onCalcularCable, 
  onCalcularNudo,
  resultadoCable,
  mostrarExplicacionCable,
  setMostrarExplicacionCable
}: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Cable className="w-5 h-5" />
          Cable Entre Postes
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Diámetro del Cable (mm)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={datosCable.diametro || ''}
              onChange={(e) => {
                const valor = Math.max(0, parseFloat(e.target.value) || 0);
                setDatosCable({ ...datosCable, diametro: valor });
              }}
              placeholder="Ejemplo: 1.5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Longitud del Cable (metros)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={datosCable.longitud || ''}
              onChange={(e) => {
                const valor = Math.max(0, parseFloat(e.target.value) || 0);
                setDatosCable({ ...datosCable, longitud: valor });
              }}
              placeholder="Ejemplo: 1"
            />
          </div>

          <button
            onClick={onCalcularCable}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Calculator className="w-5 h-5" />
            Calcular Cable
          </button>

          {resultadoCable && resultadoCable.pesoCable && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Cable Entre Postes:</h3>
              <p className="text-green-700">
                Contiene <span className="font-bold">{resultadoCable.pesoCable}</span> kg de cobre
              </p>
              <p className="text-green-700">
                Valor aproximado: <span className="font-bold">${resultadoCable.precioCable?.toLocaleString('es-CL')} CLP</span>
              </p>
              <button
                onClick={() => setMostrarExplicacionCable(!mostrarExplicacionCable)}
                className="text-green-600 hover:text-green-700 text-sm mt-2 flex items-center gap-1"
              >
                {mostrarExplicacionCable ? '▼' : '▶'} Ver cómo se calculó
              </button>
            </div>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <CircleDot className="w-5 h-5" />
          Nudo de Cables
        </h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Radio del Nudo (cm)
            <span className="text-xs text-gray-500 ml-2">
              (Mínimo 1 cm)
            </span>
          </label>
          <input
            type="number"
            step="0.5"
            min="1"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={datosCable.radio || ''}
            onChange={(e) => {
              const valor = Math.max(1, parseFloat(e.target.value) || 1);
              setDatosCable({ ...datosCable, radio: valor });
            }}
            placeholder="Ejemplo: 10"
          />
          <p className="text-xs text-gray-500 mt-1">
            Para nudos grandes con múltiples cables entrelazados
          </p>
        </div>

        <button
          onClick={onCalcularNudo}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 mt-4"
        >
          <Calculator className="w-5 h-5" />
          Calcular Nudo
        </button>
      </div>
    </div>
  );
}

export default CalculatorInputs;