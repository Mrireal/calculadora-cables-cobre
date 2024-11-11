import { create } from 'zustand';

interface DatosCable {
  diametro: number;
  longitud: number;
  radio: number;
}

interface Resultado {
  pesoCable: number | null;
  pesosNudo: { porcentaje: number; peso: number; precio: number }[];
  precioCable: number | null;
  area: number | null;
  volumenCable: number | null;
  volumenNudo: number | null;
}

interface EstadoCalculadora {
  datosCable: DatosCable;
  resultado: Resultado;
  setDatosCable: (datos: Partial<DatosCable>) => void;
  calcularCable: (precioCobreCLP: number) => void;
  calcularNudo: (precioCobreCLP: number) => void;
}

const DENSIDAD_COBRE = 8.96; // g/cm³
const PORCENTAJES = [2.5, 5, 10];

export const useAlmacenCalculadora = create<EstadoCalculadora>((set, get) => ({
  datosCable: {
    diametro: 0,
    longitud: 0,
    radio: 1,
  },
  resultado: {
    pesoCable: null,
    pesosNudo: [],
    precioCable: null,
    area: null,
    volumenCable: null,
    volumenNudo: null,
  },
  setDatosCable: (datos) => {
    set((state) => ({
      datosCable: { ...state.datosCable, ...datos },
    }));
  },
  calcularCable: (precioCobreCLP) => {
    const { datosCable } = get();
    const radio = datosCable.diametro / 2;
    const area = Math.PI * Math.pow(radio, 2);
    const volumenCable = area * (datosCable.longitud * 1000);
    const pesoCable = (volumenCable / 1000) * (DENSIDAD_COBRE / 1000);
    const precioCable = pesoCable * precioCobreCLP;

    set((state) => ({
      resultado: {
        ...state.resultado,
        pesoCable: Number(pesoCable.toFixed(5)),
        precioCable: Math.round(precioCable),
        area: Number(area.toFixed(2)),
        volumenCable: Number(volumenCable.toFixed(2)),
      },
    }));
  },
  calcularNudo: (precioCobreCLP) => {
    const { datosCable } = get();
    const volumenNudo = (4/3) * Math.PI * Math.pow(datosCable.radio, 3);
    
    const pesosNudo = PORCENTAJES.map(porcentaje => {
      const volumenCobre = volumenNudo * (porcentaje / 100);
      const pesoCobre = (volumenCobre * DENSIDAD_COBRE) / 1000;
      return {
        porcentaje,
        peso: Number(pesoCobre.toFixed(5)),
        precio: Math.round(pesoCobre * precioCobreCLP)
      };
    });

    set((state) => ({
      resultado: {
        ...state.resultado,
        pesosNudo,
        volumenNudo: Number(volumenNudo.toFixed(2)),
      },
    }));
  },
}));