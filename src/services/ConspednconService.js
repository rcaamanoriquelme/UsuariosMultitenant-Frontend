import axios from "axios";
import config from '../../config.js'; 

const BASE_API_URL = config.VUE_APP_BASE_API_URL_PEDIDOS_NO_CONCILIADOS;

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
    const response = await axios.get(`${BASE_API_URL}/api/pedidos-no-conciliados/filtros/locales`);
    return response.data;
  } catch (error) {
    console.error('Error in getLocals:', error);
    throw error;
  }
}

export async function getEstados() {
  try {
    const response = await axios.get(`${BASE_API_URL}/api/pedidos-no-conciliados/filtros/estados`);
    return response.data;
  } catch (error) {
    console.error('Error in getEstados:', error);
    throw error;
  }
}

export async function getEmisores() {
  try {
    const response = await axios.get(`${BASE_API_URL}/api/pedidos-no-conciliados/filtros/emisores`);
    return response.data;
  } catch (error) {
    console.error('Error in getEmisores:', error);
    throw error;
  }
}

export async function getFaltantes() {
  try {
    const response = await axios.get(`${BASE_API_URL}/api/pedidos-no-conciliados/filtros/faltantes`);
    return response.data;
  } catch (error) {
    console.error('Error in getFaltantes:', error);
    throw error;
  }
}

export async function getLocalesByCadena(cadena) {
  try {
    const response = await axios.get(`${BASE_API_URL}/api/pedidos-no-conciliados/filtros/localesbycadena/${cadena}`);
    return response.data;
  } catch (error) {
    console.error('Error in getLocalesByCadena:', error);
    throw error;
  }
}

export async function getOperadoresByEmisor(emisor) {
  try {
    const response = await axios.get(`${BASE_API_URL}/api/pedidos-no-conciliados/filtros/operadoresbyemisor/${emisor}`);
    return response.data;
  } catch (error) {
    console.error('Error in getOperadoresByEmisor:', error);
    throw error;
  }
}

export async function getDetalleByFiltro(filtro) {
  try {
    const response = await axios.post(`${BASE_API_URL}/api/pedidos-no-conciliados/resumenbyfiltro`, filtro);
    return response.data;
  } catch (error) {
    console.error('Error in getDetalleByFiltro:', error);
    throw error;
  }
}