interface MindicadorResponse {
  version: string;
  autor: string;
  codigo: string;
  nombre: string;
  unidad_medida: string;
  serie: {
    fecha: string;
    valor: number;
  }[];
}

export class EconomicIndicatorsService {
  static async getUF(date?: Date): Promise<number | null> {
    try {
      let url = 'https://mindicador.cl/api/uf';
      if (date) {
        const dd = String(date.getDate()).padStart(2, '0');
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const yyyy = date.getFullYear();
        url = `https://mindicador.cl/api/uf/${dd}-${mm}-${yyyy}`;
      }
      
      const response = await fetch(url);
      const data = await response.json() as MindicadorResponse;
      
      if (data && data.serie && data.serie.length > 0) {
        return data.serie[0].valor;
      }
      return null;
    } catch (error) {
      console.error('[Mindicador ❌] Error fetching UF:', error);
      return null;
    }
  }

  static async getUTM(): Promise<number | null> {
    try {
      const response = await fetch('https://mindicador.cl/api/utm');
      const data = await response.json() as MindicadorResponse;
      if (data && data.serie && data.serie.length > 0) {
        return data.serie[0].valor;
      }
      return null;
    } catch (error) {
      console.error('[Mindicador ❌] Error fetching UTM:', error);
      return null;
    }
  }

  static async getCurrentIndicators() {
    try {
      const response = await fetch('https://mindicador.cl/api');
      const data = await response.json() as any;
      return {
        uf: data.uf.valor,
        utm: data.utm.valor,
        dolar: data.dolar.valor,
        euro: data.euro.valor,
        fecha: data.fecha
      };
    } catch (error) {
      console.error('[Mindicador ❌] Error fetching general indicators:', error);
      return null;
    }
  }
}
