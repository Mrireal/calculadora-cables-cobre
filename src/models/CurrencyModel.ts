import { create } from 'zustand';

interface CurrencyState {
  usdToClp: number;
  lastUpdated: string | null;
  isLoading: boolean;
  error: string | null;
  fetchRate: () => Promise<void>;
}

const CURRENCY_API_KEY = 'cur_live_YOUR_API_KEY'; // Reemplazar con tu API key
const CACHE_KEY = 'currency_data';
const CACHE_DURATION = 60 * 60 * 1000; // 1 hora

export const useCurrencyStore = create<CurrencyState>((set) => ({
  usdToClp: 980,
  lastUpdated: null,
  isLoading: false,
  error: null,
  fetchRate: async () => {
    // Verificar cache
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { rate, timestamp } = JSON.parse(cached);
      const now = new Date().getTime();
      if (now - timestamp < CACHE_DURATION) {
        set({ usdToClp: rate, lastUpdated: new Date(timestamp).toISOString() });
        return;
      }
    }

    set({ isLoading: true });
    try {
      const response = await fetch(
        `https://api.currencyapi.com/v3/latest?apikey=${CURRENCY_API_KEY}&base_currency=USD&currencies=CLP`
      );
      const data = await response.json();
      
      if (!data.data?.CLP) {
        throw new Error('Tasa de cambio no disponible');
      }

      const rate = data.data.CLP.value;
      const timestamp = new Date().getTime();
      
      // Guardar en cache
      localStorage.setItem(CACHE_KEY, JSON.stringify({ rate, timestamp }));
      
      set({
        usdToClp: rate,
        lastUpdated: new Date().toISOString(),
        isLoading: false,
        error: null
      });
    } catch (error) {
      set({
        error: 'Error al obtener tasa de cambio',
        isLoading: false
      });
    }
  }
}));