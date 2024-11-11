import React from 'react';
import { Plus, Minus } from 'lucide-react';

interface Props {
  radio: number;
  datosCable: any;
  setDatosCable: (datos: any) => void;
  onCalcularNudo: () => void;
}

function PosteVisualization({ radio, datosCable, setDatosCable, onCalcularNudo }: Props) {
  const MIN_SIZE = 1;
  const VISUAL_MAX_SIZE = 10;
  const STEP = 0.5;

  const cmToPixels = (cm: number) => {
    const scale = 5;
    if (cm <= VISUAL_MAX_SIZE) {
      return cm * scale;
    }
    return VISUAL_MAX_SIZE * scale;
  };

  const baseSize = cmToPixels(MIN_SIZE);
  const circleSize = Math.max(baseSize, cmToPixels(radio));
  
  const adjustSize = (increment: number) => {
    const newSize = Math.max(MIN_SIZE, radio + increment);
    setDatosCable({ ...datosCable, radio: newSize });
    // Trigger calculation immediately after size change
    setTimeout(() => onCalcularNudo(), 0);
  };

  return (
    <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-gray-50 rounded-lg p-4">
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => adjustSize(-STEP)}
          className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 rounded-full transition-colors"
          aria-label="Disminuir tamaño"
          disabled={radio <= MIN_SIZE}
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
        <circle cx="50" cy="50" r="20" fill="#FFD700" />
        <line x1="30" y1="30" x2="70" y2="70" stroke="#FFD700" strokeWidth="2" />
        <line x1="70" y1="30" x2="30" y2="70" stroke="#FFD700" strokeWidth="2" />
        <line x1="50" y1="20" x2="50" y2="80" stroke="#FFD700" strokeWidth="2" />
        <line x1="20" y1="50" x2="80" y2="50" stroke="#FFD700" strokeWidth="2" />
        
        <rect x="0" y="279" width="300" height="1" fill="#666" />
        <rect x="0" y="280" width="300" height="20" fill="#8B4513" />
        
        <path
          d="M140,280 L160,280 L165,290 L135,290 Z"
          fill="#4B4B4B"
        />
        
        <rect x="145" y="80" width="10" height="200" fill="#4B4B4B" />
        
        <rect x="130" y="85" width="40" height="5" fill="#333" />
        
        <g 
          className="cursor-pointer"
          onClick={() => adjustSize(STEP)}
        >
          <circle 
            cx="150" 
            cy="80" 
            r={circleSize}
            fill="rgba(239, 68, 68, 0.2)"
            stroke="#EF4444"
            strokeWidth="2"
          />
          <circle 
            cx="150" 
            cy="80" 
            r={circleSize}
            fill="transparent"
            stroke="#EF4444"
            strokeWidth="2"
            strokeDasharray="4 2"
            className="animate-spin-slow"
            style={{ animationDuration: '8s' }}
          />
        </g>
      </svg>

      <p className="text-sm text-gray-600 mt-4">
        Radio actual: {radio.toFixed(1)} cm
        {radio > VISUAL_MAX_SIZE && (
          <span className="block text-xs text-gray-500">
            (Visualización limitada a {VISUAL_MAX_SIZE} cm)
          </span>
        )}
      </p>
    </div>
  );
}

export default PosteVisualization;