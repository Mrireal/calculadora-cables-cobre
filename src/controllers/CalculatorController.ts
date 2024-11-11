import { useEffect } from 'react';
import { useCopperStore } from '../models/CopperModel';
import { useCurrencyStore } from '../models/CurrencyModel';
import { useCalculatorStore } from '../models/CalculatorModel';

export const useCalculatorController = () => {
  const {
    priceClp: precioCobreCLP,
    lastUpdated: lastUpdatedCobre,
    isLoading: isLoadingCobre,
    error: errorCobre,
    source: sourceCobre,
    fetchPrice
  } = useCopperStore();

  const {
    usdToClp,
    lastUpdated: lastUpdatedUSD,
    isLoading: isLoadingUSD,
    error: errorUSD,
    fetchRate
  } = useCurrencyStore();

  const {
    datosCable,
    resultado,
    setDatosCable,
    calcularCable,
    calcularNudo
  } = useCalculatorStore();

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
    sourceCobre
  };
};