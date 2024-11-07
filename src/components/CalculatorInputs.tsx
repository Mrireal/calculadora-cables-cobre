import React from 'react';
import { Cable, CircleDot, Calculator } from 'lucide-react';

interface Props {
  datosCable: {
    diametro: number;
    longitud: number;
    diametroNudo: number;
  };
  setDatosCable: (datos: any) => void;
  onCalcular: () => void;
}

function CalculatorInputs({ datosCable, setDatosCable, onCalcular }: Props) {
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={datosCable.diametro || ''}
              onChange={(e) => setDatosCable({ ...datosCable, diametro: parseFloat(e.target.value) || 0 })}
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={datosCable.longitud || ''}
              onChange={(e) => setDatosCable({ ...datosCable, longitud: parseFloat(e.target.value) || 0 })}
              placeholder="Ejemplo: 1"
            />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <CircleDot className="w-5 h-5" />
          Nudo de Cables
        </h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Diámetro del Nudo (metros)
            <span className="text-xs text-gray-500 ml-2">
              (Entre 0.1 y 0.5 metros)
            </span>
          </label>
          <input
            type="number"
            step="0.01"
            min="0.1"
            max="0.5"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={datosCable.diametroNudo || ''}
            onChange={(e) => {
              const valor = parseFloat(e.target.value) || 0;
              setDatosCable({ ...datosCable, diametroNudo: valor });
            }}
            placeholder="Ejemplo: 0.2"
          />
          <p className="text-xs text-gray-500 mt-1">
            Para nudos grandes con múltiples cables entrelazados
          </p>
        </div>
      </div>

      <button
        onClick={onCalcular}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        <Calculator className="w-5 h-5" />
        Calcular
      </button>
    </div>
  );
}

export default CalculatorInputs;