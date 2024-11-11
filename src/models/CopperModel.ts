import { create } from 'zustand';
import { useCurrencyStore } from './CurrencyModel';

interface CopperState {
  priceClp: number;
  lastUpdated: string | null;
  isLoading: boolean;
  error: string | null;
  source: string;
  fetchPrice: () => Promise<void>;
}

const ALPHA_VANTAGE_API_KEY = 'VMWI0JA6E1G33DA6';
const CACHE_KEY = 'copper_price_data';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutos
const BACKUP_PRICE = 8500;

export const useCopperStore = create<CopperState>((set) => ({
  priceClp: BACKUP_PRICE,
  lastUpdated: null,
  isLoading: false,
  error: null,
  source: 'Precio referencial',
  fetchPrice: async () => {
    const { usdToClp } = useCurrencyStore.getState();
    
    // Verificar cache
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const data = JSON.parse(cached);
      const now = new Date().getTime();
      if (now - data.timestamp < CACHE_DURATION) {
        set({
          priceClp: data.price,
          lastUpdated: new Date(data.timestamp).toISOString(),
          source: data.isBackup ? 'Precio referencial' : 'Alpha Vantage API'
        });
        return;
      }
    }

    set({ isLoading: true });
    try {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=COPPER&apikey=${ALPHA_VANTAGE_API_KEY}`
      );
      const data = await response.json();

      if (!data['Global Quote'] || !data['Global Quote']['05. price']) {
        throw new Error('Datos de precio no disponibles');
      }

      const priceUsdPerLb = parseFloat(data['Global Quote']['05. price']);
      const priceUsdPerKg = priceUsdPerLb * 2.20462;
      const priceClp = priceUsdPerKg * usdToClp;
      const timestamp = new Date().getTime();

      // Guardar en cache
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          price: priceClp,
          timestamp,
          isBackup: false
        })
      );

      set({
        priceClp,
        lastUpdated: new Date().toISOString(),
        isLoading: false,
        error: null,
        source: 'Alpha Vantage API'
      });
    } catch (error) {
      set({
        priceClp: BACKUP_PRICE,
        error: 'Error al obtener precio del cobre',
        isLoading: false,
        source: 'Precio referencial'
      });
    }
  }
}));