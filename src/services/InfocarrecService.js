import axios from "axios";
import config from '../../config.js'; 

export const BASE_API_URL = config.VUE_APP_BASE_API_URL_CARTA_DE_RECLAMO;

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
    const response = await axios.get(`${BASE_API_URL}/api/informes/carta-de-reclamo/filtros/locales`);
    return response.data;
  } catch (error) {
    console.error('Error in getLocals:', error);
    throw error;
  }
}

export async function getLocalesByCadena(cadena) {
  try {
    const response = await axios.get(`${BASE_API_URL}/api/informes/carta-de-reclamo/filtros/localesbycadena/${cadena}`);
    return response.data;
  } catch (error) {
    console.error('Error in getLocalesByCadena:', error);
    throw error;
  }
}

export async function getEmisores() {
  try {
    const response = await axios.get(`${BASE_API_URL}/api/informes/carta-de-reclamo/filtros/emisores`);
    return response.data;
  } catch (error) {
    console.error('Error in getEmisores:', error);
    throw error;
  }
}

export async function getOperadoresByEmisor(emisor) {
  try {
    const response = await axios.get(`${BASE_API_URL}/api/informes/carta-de-reclamo/filtros/operadoresbyemisor/${emisor}`);
    return response.data;
  } catch (error) {
    console.error('Error in getOperadoresByEmisor:', error);
    throw error;
  }
}

export async function getTarjetasByEmisor(emisor) {
  try {
    const response = await axios.get(`${BASE_API_URL}/api/informes/carta-de-reclamo/filtros/tarjetasbyemisor/${emisor}`);
    return response.data;
  } catch (error) {
    console.error('Error in getTarjetasByEmisor:', error);
    throw error;
  }
}

export async function getTipoTrxByEmisor(emisor) {
  try {
    const response = await axios.get(`${BASE_API_URL}/api/informes/carta-de-reclamo/filtros/tipotrxbyemisor/${emisor}`);
    return response.data;
  } catch (error) {
    console.error('Error in getTipoTrxByEmisor:', error);
    throw error;
  }
}

export async function getDetalleCartaDeReclamoByFiltro(filtro) {
  try {
    const response = await axios.post(`${BASE_API_URL}/api/informes/carta-de-reclamo/resumenbyfiltro`, filtro);
    return response.data;
  } catch (error) {
    console.error('Error in getDetalleCartaDeReclamoByFiltro:', error);
    throw error;
  }
}
