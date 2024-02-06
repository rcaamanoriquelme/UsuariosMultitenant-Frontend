import axios from "axios";
import config from '../../config.js'; 

const BASE_API_URL = config.VUE_APP_BASE_API_URL_TARJETA_OH;

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

export async function getLocales() {
  try {
    const response = await axios.get(`${BASE_API_URL}/api/informes/comisiones/tarjeta-oh/filtros/locales`);
    return response.data;
  } catch (error) {
    console.error('Error in getLocals:', error);
    throw error;
  }
}

export async function getLocalesByCadena(cadena) {
  try {
    const response = await axios.get(`${BASE_API_URL}/api/informes/comisiones/tarjeta-oh/filtros/localesbycadena/${cadena}`);
    return response.data;
  } catch (error) {
    console.error('Error in getLocalesByCadena:', error);
    throw error;
  }
}

export async function getTipoDeReporte() {
    try {
      const response = await axios.get(`${BASE_API_URL}/api/informes/comisiones/tarjeta-oh/filtros/tiposdereporte`);
      return response.data;
    } catch (error) {
      console.error('Error in getTipoDeReporte:', error);
      throw error;
    }
}

export async function getDetalleByFiltro(filtro) {
  try {
    const response = await axios.post(`${BASE_API_URL}/api/informes/comisiones/tarjeta-oh/resumenbyfiltro`, filtro);
    return response.data;
  } catch (error) {
    console.error('Error in getTotalPagosByFiltro:', error);
    throw error;
  }
}