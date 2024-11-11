import useSWR from 'swr';

const ALPHA_VANTAGE_API_KEY = 'VMWI0JA6E1G33DA6';
const CACHE_KEY = 'copper_price_data';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutos en milisegundos
const BACKUP_PRICE = 8500; // Precio de respaldo en CLP/kg
const USD_TO_CLP = 980; // Tasa de cambio aproximada

interface CacheData {
  price: number;
  timestamp: string;
  isBackup: boolean;
}

const getCachedData = (): CacheData | null => {
  const cached = localStorage.getItem(CACHE_KEY);
  if (!cached) return null;

  const data = JSON.parse(cached);
  const now = new Date().getTime();
  const timestamp = new Date(data.timestamp).getTime();

  // Verificar si el cache ha expirado
  if (now - timestamp > CACHE_DURATION) {
    localStorage.removeItem(CACHE_KEY);
    return null;
  }

  return data;
};

const setCachedData = (data: CacheData) => {
  localStorage.setItem(CACHE_KEY, JSON.stringify(data));
};

const fetcher = async (url: string) => {
  // Primero verificar el cache
  const cachedData = getCachedData();
  if (cachedData) {
    return cachedData;
  }

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Error en la respuesta del servidor');
    const data = await res.json();
    
    // Verificar la estructura de la respuesta de Alpha Vantage
    if (!data['Global Quote'] || !data['Global Quote']['05. price']) {
      throw new Error('Datos de precio no disponibles');
    }
    
    // El precio viene en USD/lb, convertir a CLP/kg
    const priceUsdPerLb = parseFloat(data['Global Quote']['05. price']);
    const priceUsdPerKg = priceUsdPerLb * 2.20462; // convertir lb a kg
    const priceClpPerKg = priceUsdPerKg * USD_TO_CLP;
    
    const responseData = {
      price: priceClpPerKg,
      timestamp: new Date().toISOString(),
      isBackup: false
    };

    // Guardar en cache
    setCachedData(responseData);
    
    return responseData;
  } catch (error) {
    console.error('Error al obtener el precio del cobre:', error);
    
    // Si hay un error, usar el precio de respaldo
    const backupData = {
      price: BACKUP_PRICE,
      timestamp: new Date().toISOString(),
      isBackup: true
    };

    setCachedData(backupData);
    return backupData;
  }
};

export function useCopperPrice() {
  const { data, error, isLoading } = useSWR(
    `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=COPPER&apikey=${ALPHA_VANTAGE_API_KEY}`,
    fetcher,
    {
      refreshInterval: CACHE_DURATION,
      revalidateOnFocus: false,
      fallbackData: {
        price: BACKUP_PRICE,
        timestamp: new Date().toISOString(),
        isBackup: true
      }
    }
  );

  return {
    price: data?.price || BACKUP_PRICE,
    source: data?.isBackup ? 'Precio referencial' : 'Alpha Vantage API',
    lastUpdated: data?.timestamp ? new Date(data.timestamp).toLocaleString() : null,
    isLoading,
    error: error?.message,
  };
}