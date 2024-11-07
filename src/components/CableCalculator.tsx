import React, { useState, useCallback } from 'react';
import { Calculator, Cable, Info, Clock } from 'lucide-react';
import CalculatorInputs from './CalculatorInputs';
import CalculatorResults from './CalculatorResults';
import PosteVisualization from './PosteVisualization';
import { useCopperPrice } from '../hooks/useCopperPrice';

interface DatosCable {
  diametro: number;
  longitud: number;
  diametroNudo: number;
}

const DENSIDAD_COBRE = 8.96; // g/cm³

function CalculadoraCable() {
  const { price: PRECIO_COBRE_CLP, source, lastUpdated, isLoading, error } = useCopperPrice();
  const [datosCable, setDatosCable] = useState<DatosCable>({
    diametro: 0,
    longitud: 0,
    diametroNudo: 0.02, // Valor inicial en metros (2cm)
  });
  const [mostrarExplicacion, setMostrarExplicacion] = useState(false);
  const [resultado, setResultado] = useState<{
    pesoCable: number | null;
    pesoNudo: number | null;
    precioCable: number | null;
    precioNudo: number | null;
    area: number | null;
    volumenCable: number | null;
    volumenNudo: number | null;
  }>({
    pesoCable: null,
    pesoNudo: null,
    precioCable: null,
    precioNudo: null,
    area: null,
    volumenCable: null,
    volumenNudo: null,
  });

  const calcularContenidoCobre = useCallback(() => {
    // Cálculo para cable entre postes
    const radio = datosCable.diametro / 2;
    const area = Math.PI * Math.pow(radio, 2);
    const volumenCable = area * (datosCable.longitud * 1000); // Convertir metros a mm
    const pesoCable = (volumenCable / 1000) * (DENSIDAD_COBRE / 1000); // Convertir a kg

    // Cálculo para nudo (aproximación esférica)
    // El diámetro del nudo está en metros, convertir a mm³
    const volumenNudo = datosCable.diametroNudo > 0 
      ? (4/3) * Math.PI * Math.pow((datosCable.diametroNudo * 1000)/2, 3) // convertir m a mm
      : 0;
    const pesoNudo = (volumenNudo / 1000) * (DENSIDAD_COBRE / 1000); // Convertir a kg

    // Cálculo de precios
    const precioCable = pesoCable * PRECIO_COBRE_CLP;
    const precioNudo = pesoNudo * PRECIO_COBRE_CLP;

    setResultado({
      pesoCable: Number(pesoCable.toFixed(5)),
      pesoNudo: Number(pesoNudo.toFixed(5)),
      precioCable: Math.round(precioCable),
      precioNudo: Math.round(precioNudo),
      area: Number(area.toFixed(2)),
      volumenCable: Number(volumenCable.toFixed(2)),
      volumenNudo: Number(volumenNudo.toFixed(2)),
    });
  }, [datosCable, PRECIO_COBRE_CLP]);

  // Actualizar cálculos cuando cambia el tamaño del nudo
  const actualizarDatosCable = useCallback((nuevosDatos: DatosCable) => {
    setDatosCable(nuevosDatos);
    calcularContenidoCobre();
  }, [calcularContenidoCobre]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Cable className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">Calculadora de Cobre en Cables</h1>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
              <div className="space-y-2">
                <p className="text-sm text-blue-800">
                  Esta herramienta calcula el contenido de cobre en cables eléctricos y nudos de cable.
                  {isLoading ? (
                    <span className="block">Cargando precio actual del cobre...</span>
                  ) : error ? (
                    <span className="block text-red-600">Error al cargar el precio: {error}</span>
                  ) : (
                    <>
                      <span className="block">
                        Precio actual del cobre: ${PRECIO_COBRE_CLP.toLocaleString('es-CL')} CLP/kg
                        <span className="text-xs ml-2">Fuente: {source}</span>
                      </span>
                      {lastUpdated && (
                        <span className="block text-xs flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3" />
                          Última actualización: {lastUpdated}
                        </span>
                      )}
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <CalculatorInputs
                datosCable={datosCable}
                setDatosCable={actualizarDatosCable}
                onCalcular={calcularContenidoCobre}
              />
              <CalculatorResults
                resultado={resultado}
                datosCable={datosCable}
                mostrarExplicacion={mostrarExplicacion}
                setMostrarExplicacion={setMostrarExplicacion}
              />
            </div>
            <PosteVisualization 
              diametroNudo={datosCable.diametroNudo}
              setDatosCable={actualizarDatosCable}
              datosCable={datosCable}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CalculadoraCable;