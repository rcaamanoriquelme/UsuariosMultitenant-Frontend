import axios from 'axios';
import config from '../../config.js';  

const VUE_APP_BASE_API_URL_SALGO_VIGENTE = config.VUE_APP_BASE_API_URL_SALGO_VIGENTE;

export async function getCadenas() {
  try {
        
    const userData = JSON.parse(localStorage.getItem('userData'));

    if (!userData || !userData.cadenas) {
        return []; 
    }

    return userData.cadenas.map(chain => {
        const [id, value] = chain.split(',');
        return {
            id,
            value
        };
    });
    
  } catch (error) {
    console.error('Error al obtener las cadenas:', error);
    throw error;
  }
}

export const getLocales= async () => {
  
  try {
        console.log('getLocales: ');
        const response = await axios.get(`${VUE_APP_BASE_API_URL_SALGO_VIGENTE}/filtros/locales`);
    return response.data;

  } catch (error) {
        console.error(error);
  }

};

export const getEmisores= async () => {
  
  try {
        console.log('getEmisores: ');
        const response = await axios.get(`${VUE_APP_BASE_API_URL_SALGO_VIGENTE}/filtros/emisores`);
    return response.data;

  } catch (error) {
        console.error(error);
  }

};

export const getLocalesByCadena= async (cadena) => {
  
  try {
        console.log('getLocalesByCadena:');
        const response = await axios.get(`${VUE_APP_BASE_API_URL_SALGO_VIGENTE}/filtros/localesbycadena/${cadena}`);
    return response.data;

  } catch (error) {
        console.error(error);
  }

};

export const getOperadoresByEmisor= async (emisor) => {
  
  try {
        console.log('getOperadoresByEmisor: ');
        const response = await axios.get(`${VUE_APP_BASE_API_URL_SALGO_VIGENTE}/filtros/operadoresbyemisor/${emisor}`);
    return response.data;

  } catch (error) {
        console.error(error);
  }

};

export const getSaldos= async (payload) => {
  
  try {
        console.log('getSaldos: ', payload);
        const response = await axios.post(`${VUE_APP_BASE_API_URL_SALGO_VIGENTE}/saldo/vigentes`, payload);
    return response.data;

  } catch (error) {
        console.error(error);
  }

};

export const getDetalleSaldos= async (payload) => {
  
  try {
        console.log('getDetalleSaldos: ', payload);
        const response = await axios.post(`${VUE_APP_BASE_API_URL_SALGO_VIGENTE}/saldo/vigentes/detalle`, payload);
    return response.data;

  } catch (error) {
        console.error(error);
  }

};