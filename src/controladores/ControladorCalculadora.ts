import { useEffect } from 'react';
import { useAlmacenCobre } from '../modelos/ModeloCobre';
import { useAlmacenMoneda } from '../modelos/ModeloMoneda';
import { useAlmacenCalculadora } from '../modelos/ModeloCalculadora';

export const useControladorCalculadora = () => {
  const {
    priceClp: precioCobreCLP,
    lastUpdated: lastUpdatedCobre,
    isLoading: isLoadingCobre,
    error: errorCobre,
    source: sourceCobre,
    fetchPrice,
    alphaVantagePrice: precioAlphaVantage
  } = useAlmacenCobre();

  const {
    usdToClp,
    lastUpdated: lastUpdatedUSD,
    isLoading: isLoadingUSD,
    error: errorUSD,
    fetchRate
  } = useAlmacenMoneda();

  const {
    datosCable,
    resultado,
    setDatosCable,
    calcularCable,
    calcularNudo
  } = useAlmacenCalculadora();

  useEffect(() => {
    fetchRate();
    fetchPrice();
  }, []);

  const handleCalcularCable = () => {
    calcularCable(precioCobreCLP);
  };

  const handleCalcularNudo = () => {
    calcularNudo(precioCobreCLP);
  };

  return {
    datosCable,
    resultado,
    setDatosCable,
    calcularCable: handleCalcularCable,
    calcularNudo: handleCalcularNudo,
    precioCobreCLP,
    usdToClp,
    lastUpdatedCobre,
    lastUpdatedUSD,
    isLoading: isLoadingCobre || isLoadingUSD,
    error: errorCobre || errorUSD,
    sourceCobre,
    precioAlphaVantage
  };
};