import React from 'react';
import { Plus, Minus } from 'lucide-react';

interface Props {
  diametroNudo: number;
  datosCable: any;
  setDatosCable: (datos: any) => void;
}

function PosteVisualization({ diametroNudo, datosCable, setDatosCable }: Props) {
  const MIN_SIZE = 0.1; // 10cm en metros
  const MAX_SIZE = 0.5; // 50cm en metros
  const STEP = 0.02; // 2cm en metros

  // Convertir metros a píxeles para la visualización
  const meterToPixels = (meters: number) => meters * 500; // Factor de escala aumentado
  const baseSize = meterToPixels(MIN_SIZE);
  const maxSize = meterToPixels(MAX_SIZE);
  const circleSize = Math.min(maxSize, Math.max(baseSize, meterToPixels(diametroNudo)));
  
  const adjustSize = (increment: number) => {
    if (setDatosCable) {
      const newSize = Math.min(MAX_SIZE, Math.max(MIN_SIZE, diametroNudo + increment));
      setDatosCable({ ...datosCable, diametroNudo: newSize });
    }
  };

  return (
    <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-gray-50 rounded-lg p-4">
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => adjustSize(-STEP)}
          className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 rounded-full transition-colors"
          aria-label="Disminuir tamaño"
        >
          <Minus className="w-5 h-5" />
        </button>
        <button
          onClick={() => adjustSize(STEP)}
          className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 rounded-full transition-colors"
          aria-label="Aumentar tamaño"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <svg width="300" height="300" viewBox="0 0 300 300" className="max-w-full h-auto">
        {/* Sol */}
        <circle cx="50" cy="50" r="20" fill="#FFD700" />
        <line x1="30" y1="30" x2="70" y2="70" stroke="#FFD700" strokeWidth="2" />
        <line x1="70" y1="30" x2="30" y2="70" stroke="#FFD700" strokeWidth="2" />
        <line x1="50" y1="20" x2="50" y2="80" stroke="#FFD700" strokeWidth="2" />
        <line x1="20" y1="50" x2="80" y2="50" stroke="#FFD700" strokeWidth="2" />
        
        {/* Suelo con sombra */}
        <rect x="0" y="279" width="300" height="1" fill="#666" />
        <rect x="0" y="280" width="300" height="20" fill="#8B4513" />
        
        {/* Base del poste */}
        <path
          d="M140,280 L160,280 L165,290 L135,290 Z"
          fill="#4B4B4B"
        />
        
        {/* Poste principal */}
        <rect x="145" y="80" width="10" height="200" fill="#4B4B4B" />
        
        {/* Soporte superior */}
        <rect x="130" y="85" width="40" height="5" fill="#333" />
        
        {/* Nudo (círculo rojo interactivo) */}
        <g 
          className="cursor-pointer"
          onClick={() => adjustSize(STEP)}
        >
          <circle 
            cx="150" 
            cy="80" 
            r={circleSize / 2}
            fill="rgba(239, 68, 68, 0.2)"
            stroke="#EF4444"
            strokeWidth="2"
          />
          <circle 
            cx="150" 
            cy="80" 
            r={circleSize / 2}
            fill="transparent"
            stroke="#EF4444"
            strokeWidth="2"
            strokeDasharray="4 2"
            className="animate-spin-slow"
            style={{ animationDuration: '8s' }}
          />
        </g>
        
        {/* Flecha con etiqueta */}
        <path 
          d="M200,80 L240,80 L230,70 M240,80 L230,90" 
          stroke="#333" 
          strokeWidth="2" 
          fill="none"
        />
        <text x="205" y="70" className="text-sm" fill="#666">
          Click para aumentar
        </text>
      </svg>

      <p className="text-sm text-gray-600 mt-4">
        Diámetro actual: {diametroNudo.toFixed(2)} metros
      </p>
    </div>
  );
}

export default PosteVisualization;