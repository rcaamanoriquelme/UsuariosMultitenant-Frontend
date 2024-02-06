import axios from "axios";
import config from '../../config.js'; 

export const BASE_API_URL = config.VUE_APP_BASE_API_URL_MP_MONITOR_DE_CONCILIACION;

export async function getCadenas() {
  try {
        
    const userData = JSON.parse(localStorage.getItem('userData'));

    if (!userData || !userData.cadenas) {
        return []; 
    }

    return userData.cadenas.map(chain => {
        const [idCadena, cadNombre] = chain.split(',');
        return {
          idCadena,
          cadNombre
        };
    });
    
  } catch (error) {
    console.error('Error al obtener las cadenas:', error);
    throw error;
  }
}
  
export async function getDetalleByFiltro(filtro) {
    try {
      const response = await axios.post(`${BASE_API_URL}/api/mp-monitor-de-conciliacion/resumenbyfiltro`, filtro);
      return response.data;
    } catch (error) {
      console.error('Error in getDetalleByFiltro:', error);
      throw error;
    }
  }

  export async function getDetalleLogArchivoFiltro(filtroLog) {
    try {
      const response = await axios.post(`${BASE_API_URL}/api/mp-monitor-de-conciliacion/detalle/logarchivos`, filtroLog);
      return response.data;
    } catch (error) {
      console.error('Error in getDetalleLogArchivoFiltro:', error);
      throw error;
    }
  }