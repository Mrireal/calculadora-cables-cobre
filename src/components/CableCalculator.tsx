import React, { useState, useCallback } from 'react';
import { Calculator, Cable, Info, Clock } from 'lucide-react';
import CalculatorInputs from './CalculatorInputs';
import CalculatorResults from './CalculatorResults';
import PosteVisualization from './PosteVisualization';
import { useCopperPrice } from '../hooks/useCopperPrice';

interface DatosCable {
  diametro: number;
  longitud: number;
  radio: number;
}

const DENSIDAD_COBRE = 8.96; // g/cm³
const PORCENTAJES = [2.5, 5, 10];

function CalculadoraCable() {
  const { price: PRECIO_COBRE_CLP, source, lastUpdated, isLoading, error } = useCopperPrice();
  const [datosCable, setDatosCable] = useState<DatosCable>({
    diametro: 0,
    longitud: 0,
    radio: 1,
  });
  const [mostrarExplicacionCable, setMostrarExplicacionCable] = useState(false);
  const [mostrarExplicacionNudo, setMostrarExplicacionNudo] = useState(false);
  const [resultado, setResultado] = useState<{
    pesoCable: number | null;
    pesosNudo: { porcentaje: number; peso: number; precio: number }[];
    precioCable: number | null;
    area: number | null;
    volumenCable: number | null;
    volumenNudo: number | null;
  }>({
    pesoCable: null,
    pesosNudo: [],
    precioCable: null,
    area: null,
    volumenCable: null,
    volumenNudo: null,
  });

  const calcularCable = useCallback(() => {
    const radio = datosCable.diametro / 2;
    const area = Math.PI * Math.pow(radio, 2);
    const volumenCable = area * (datosCable.longitud * 1000);
    const pesoCable = (volumenCable / 1000) * (DENSIDAD_COBRE / 1000);
    const precioCable = pesoCable * PRECIO_COBRE_CLP;

    setResultado(prev => ({
      ...prev,
      pesoCable: Number(pesoCable.toFixed(5)),
      precioCable: Math.round(precioCable),
      area: Number(area.toFixed(2)),
      volumenCable: Number(volumenCable.toFixed(2)),
    }));
  }, [datosCable.diametro, datosCable.longitud, PRECIO_COBRE_CLP]);

  const calcularNudo = useCallback(() => {
    const volumenNudo = (4/3) * Math.PI * Math.pow(datosCable.radio, 3);
    
    const pesosNudo = PORCENTAJES.map(porcentaje => {
      const volumenCobre = volumenNudo * (porcentaje / 100);
      const pesoCobre = (volumenCobre * DENSIDAD_COBRE) / 1000;
      return {
        porcentaje,
        peso: Number(pesoCobre.toFixed(5)),
        precio: Math.round(pesoCobre * PRECIO_COBRE_CLP)
      };
    });

    setResultado(prev => ({
      ...prev,
      pesosNudo,
      volumenNudo: Number(volumenNudo.toFixed(2)),
    }));
  }, [datosCable.radio, PRECIO_COBRE_CLP]);

  const actualizarDatosCable = useCallback((nuevosDatos: DatosCable) => {
    setDatosCable(nuevosDatos);
  }, []);

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
              <div>
                <p className="text-blue-800">
                  Esta herramienta calcula el contenido de cobre en cables eléctricos y nudos de cable.
                </p>
                <div className="mt-2 space-y-1">
                  {isLoading ? (
                    <p className="text-blue-700">Actualizando precio del cobre...</p>
                  ) : error ? (
                    <p className="text-red-600">Error al obtener el precio: {error}</p>
                  ) : (
                    <>
                      <p className="text-blue-700 font-medium">
                        Precio actual del cobre: ${PRECIO_COBRE_CLP.toLocaleString('es-CL')} CLP/kg
                        <span className="text-sm ml-2 text-blue-600">
                          Fuente: {source}
                        </span>
                      </p>
                      {lastUpdated && (
                        <p className="text-sm text-blue-600 flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Última actualización: {lastUpdated}
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <CalculatorInputs
                datosCable={datosCable}
                setDatosCable={actualizarDatosCable}
                onCalcularCable={calcularCable}
                onCalcularNudo={calcularNudo}
                resultadoCable={{
                  pesoCable: resultado.pesoCable,
                  precioCable: resultado.precioCable
                }}
                mostrarExplicacionCable={mostrarExplicacionCable}
                setMostrarExplicacionCable={setMostrarExplicacionCable}
              />
              <CalculatorResults
                resultado={resultado}
                datosCable={datosCable}
                mostrarExplicacion={mostrarExplicacionNudo}
                setMostrarExplicacion={setMostrarExplicacionNudo}
                mostrarSoloCable={false}
              />
            </div>
            <PosteVisualization 
              radio={datosCable.radio}
              setDatosCable={actualizarDatosCable}
              datosCable={datosCable}
              onCalcularNudo={calcularNudo}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CalculadoraCable;