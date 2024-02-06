import axios from "axios";
import config from '../../config.js'; 

const BASE_API_URL = config.VUE_APP_BASE_API_URL_PAGO_DE_SERVICIOS;

export async function getCadenas() {
  {
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
}

export async function getLocales() {
  try {
    const response = await axios.get(`${BASE_API_URL}/api/informes/comisiones/pago-de-servicios/filtros/locales`);
    return response.data;
  } catch (error) {
    console.error('Error in getLocals:', error);
    throw error;
  }
}

export async function getLocalesByCadena(cadena) {
  try {
    const response = await axios.get(`${BASE_API_URL}/api/informes/comisiones/pago-de-servicios/filtros/localesbycadena/${cadena}`);
    return response.data;
  } catch (error) {
    console.error('Error in getLocalesByCadena:', error);
    throw error;
  }
}

export async function getEmisores() {
  try {
    const response = await axios.get(`${BASE_API_URL}/api/informes/comisiones/pago-de-servicios/filtros/emisores`);
    return response.data;
  } catch (error) {
    console.error('Error in getEmisores:', error);
    throw error;
  }
}

export async function getTipoTrxByEmisor(emisor) {
  try {
    const response = await axios.get(`${BASE_API_URL}/api/informes/comisiones/pago-de-servicios/filtros/tipotrxbyemisor/${emisor}`);
    return response.data;
  } catch (error) {
    console.error('Error in getTipoTrxByEmisor:', error);
    throw error;
  }
}

export async function getEstadoConciliaciones() {
  try {
    const response = await axios.get(`${BASE_API_URL}/api/informes/comisiones/pago-de-servicios/filtros/estado-conciliacion`);
    return response.data;
  } catch (error) {
    console.error('Error in getEstadoConciliaciones:', error);
    throw error;
  }
}

export async function getEstadoLiquidaciones() {
  try {
    const response = await axios.get(`${BASE_API_URL}/api/informes/comisiones/pago-de-servicios/filtros/estado-liquidacion`);
    return response.data;
  } catch (error) {
    console.error('Error in getEstadoLiquidaciones:', error);
    throw error;
  }
}

export async function getTotalPagosByFiltro(filtro) {
  try {
    const response = await axios.post(`${BASE_API_URL}/api/informes/comisiones/pago-de-servicios/resumenbyfiltro`, filtro);
    return response.data;
  } catch (error) {
    console.error('Error in getTotalPagosByFiltro:', error);
    throw error;
  }
}

export async function getDetalleByFiltro(filtro) {
  try {
    const response = await axios.post(`${BASE_API_URL}/api/informes/comisiones/pago-de-servicios/resumendetallebyfiltro`, filtro);
    return response.data;
  } catch (error) {
    console.error('Error in getDetalleByFiltro:', error);
    throw error;
  }
}