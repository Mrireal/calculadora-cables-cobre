import React, { useState } from 'react';
import { Calculator, Cable, Info, Clock } from 'lucide-react';
import EntradasCalculadora from './EntradasCalculadora';
import ResultadosCalculadora from './ResultadosCalculadora';
import VisualizacionPoste from './VisualizacionPoste';
import { useControladorCalculadora } from '../controladores/ControladorCalculadora';

function CalculadoraCable() {
  const {
    datosCable,
    resultado,
    setDatosCable,
    calcularCable,
    calcularNudo,
    precioCobreCLP,
    usdToClp,
    lastUpdatedCobre,
    isLoading,
    error,
    sourceCobre,
    precioAlphaVantage
  } = useControladorCalculadora();

  const [mostrarExplicacionCable, setMostrarExplicacionCable] = useState(false);
  const [mostrarExplicacionNudo, setMostrarExplicacionNudo] = useState(false);

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
                        Precio actual del cobre: ${precioCobreCLP.toLocaleString('es-CL')} CLP/kg
                        <span className="text-sm ml-2 text-blue-600">
                          Fuente: {sourceCobre}
                        </span>
                      </p>
                      {precioAlphaVantage && (
                        <p className="text-sm text-blue-600">
                          Precio Alpha Vantage: ${precioAlphaVantage.toLocaleString('es-CL')} CLP/kg
                        </p>
                      )}
                      {lastUpdatedCobre && (
                        <p className="text-sm text-blue-600 flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Última actualización: {new Date(lastUpdatedCobre).toLocaleString('es-CL')}
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
              <EntradasCalculadora
                datosCable={datosCable}
                setDatosCable={setDatosCable}
                onCalcularCable={calcularCable}
                onCalcularNudo={calcularNudo}
                resultadoCable={{
                  pesoCable: resultado.pesoCable,
                  precioCable: resultado.precioCable
                }}
                mostrarExplicacionCable={mostrarExplicacionCable}
                setMostrarExplicacionCable={setMostrarExplicacionCable}
              />
              <ResultadosCalculadora
                resultado={resultado}
                datosCable={datosCable}
                mostrarExplicacion={mostrarExplicacionNudo}
                setMostrarExplicacion={setMostrarExplicacionNudo}
                mostrarSoloCable={false}
              />
            </div>
            <VisualizacionPoste 
              radio={datosCable.radio}
              setDatosCable={setDatosCable}
              datosCable={datosCable}
              onCalcularNudo={calcularNudo}
              tasaCambio={usdToClp}
            />
          </div>

          <div className="text-center mt-8 text-gray-600 text-sm">
            Desarrollador: Israel González
          </div>
        </div>
      </div>
    </div>
  );
}

export default CalculadoraCable;