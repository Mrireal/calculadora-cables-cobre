import useSWR from 'swr';

const BACKUP_PRICE = 8500; // Precio de respaldo en CLP/kg
const USD_TO_CLP = 980; // Tasa de cambio aproximada

const fetcher = async (url: string) => {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Error en la respuesta del servidor');
    const data = await res.json();
    
    if (!data.data?.priceUsd) {
      throw new Error('Datos de precio no disponibles');
    }
    
    // Convertir USD/ton a CLP/kg
    const pricePerKg = (parseFloat(data.data.priceUsd) / 1000) * USD_TO_CLP;
    
    return {
      price: pricePerKg,
      timestamp: data.timestamp || new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error al obtener el precio del cobre:', error);
    return {
      price: BACKUP_PRICE,
      timestamp: new Date().toISOString(),
      isBackup: true
    };
  }
};

export function useCopperPrice() {
  const { data, error, isLoading } = useSWR(
    'https://api.coincap.io/v2/assets/copper',
    fetcher,
    {
      refreshInterval: 60000, // Actualizar cada minuto
      revalidateOnFocus: true,
      fallbackData: {
        price: BACKUP_PRICE,
        timestamp: new Date().toISOString(),
        isBackup: true
      }
    }
  );

  return {
    price: data?.price || BACKUP_PRICE,
    source: data?.isBackup ? 'Precio referencial' : 'CoinCap API',
    lastUpdated: data?.timestamp ? new Date(data.timestamp).toLocaleString() : null,
    isLoading,
    error: error?.message,
  };
}