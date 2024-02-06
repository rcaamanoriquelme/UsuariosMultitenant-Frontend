import axios from "axios";
import config from '../../config.js'; 

const BASE_API_URL = config.VUE_APP_BASE_API_URL_ESTADISTICAS_GENERALES;

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
    const response = await axios.get(`${BASE_API_URL}/api/estadisticas-generales/filtros/locales`);
    return response.data;
  } catch (error) {
    console.error('Error in getLocals:', error);
    throw error;
  }
}

export async function getEmisores() {
  try {
    const response = await axios.get(`${BASE_API_URL}/api/estadisticas-generales/filtros/emisores`);
    return response.data;
  } catch (error) {
    console.error('Error in getEmisores:', error);
    throw error;
  }
}

export async function getLocalesByCadena(cadena) {
  try {
    const response = await axios.get(`${BASE_API_URL}/api/estadisticas-generales/filtros/localesbycadena/${cadena}`);
    return response.data;
  } catch (error) {
    console.error('Error in getLocalesByCadena:', error);
    throw error;
  }
}

export async function getDetalleByFiltro(filtro) {
  try {
    const response = await axios.post(`${BASE_API_URL}/api/estadisticas-generales/resumenbyfiltro`, filtro);
    return response.data;
  } catch (error) {
    console.error('Error in getDetalleByFiltro:', error);
    throw error;
  }
}