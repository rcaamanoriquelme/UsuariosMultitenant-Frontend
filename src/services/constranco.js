import axios from 'axios';

const config = require('../../config.js')
const VUE_APP_BASE_API_URL_CONSULTA_TRX = config.VUE_APP_BASE_API_URL_CONSULTA_TRX;

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

export async function getEmisores() {
  try {
    const response = await axios.get(`${VUE_APP_BASE_API_URL_CONSULTA_TRX}/transacciones/combobox/emisores`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener los emisores:', error);
    throw error;
  }
}

export async function getTipos() {
  try {
    const response = await axios.get(`${VUE_APP_BASE_API_URL_CONSULTA_TRX}/transacciones/combobox/tipos`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener los tipos:', error);
    throw error;
  }
}

export async function getEstados() {
  try {
    const response = await axios.get(`${VUE_APP_BASE_API_URL_CONSULTA_TRX}/transacciones/combobox/estados`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener los estados:', error);
    throw error;
  }
}

export async function getLocales(cadena) {
  try {
    const response = await axios.get(`${VUE_APP_BASE_API_URL_CONSULTA_TRX}/transacciones/combobox/locales`, { params: { cadena } });
    return response.data;
  } catch (error) {
    console.error('Error al obtener los locales:', error);
    throw error;
  }
}

export async function getTransacciones(payload) {
 

  try {
    const response = await axios.post(`${VUE_APP_BASE_API_URL_CONSULTA_TRX}/transacciones/buscar`, 
    payload);
    console.log('response.data', response);

    return response;
  } catch (error) {
    console.error('Error al obtener las transacciones:', error);
    throw error;
  }
}
