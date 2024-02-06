import axios from 'axios';
import config from '../../config.js';  

const VUE_APP_BASE_API_URL_VENTAS_MENSUALES = config. VUE_APP_BASE_API_URL_VENTAS_MENSUALES;
const VUE_APP_BASE_API_URL_INFO_COMISIONES = config.VUE_APP_BASE_API_URL_INFO_COMISIONES;

export const fetchChains = async () => {

    const userData = JSON.parse(localStorage.getItem('userData'));

    if (!userData || !userData.cadenas) {
        return []; 
    }

    const data = userData.cadenas.map(chain => {
       const [id, value] = chain.split(',');
       return {
           id,
           value
             };
       });
    return data;
};

export const fetchLocals = async (chainSelected) => {
  const response = await axios.get(`${VUE_APP_BASE_API_URL_VENTAS_MENSUALES}/ventas/combobox/locales?cadena=${chainSelected}`);
  return response.data;
};

export const fetchIssuers = async () => {
  const response = await axios.get(`${VUE_APP_BASE_API_URL_VENTAS_MENSUALES }/ventas/combobox/emisores`);
  return response.data;
};

export const fetchCards = async (selectedIssuer) => {
  if(selectedIssuer) {
    const response = await axios.get(`${VUE_APP_BASE_API_URL_INFO_COMISIONES}/informe/comisiones/tarjetas?idEmisor=${selectedIssuer}`);
    return response.data;
  } else {
    return [];
  }
};

export const fetchTransactionTypes = async () => {
  const response = await axios.get(`${VUE_APP_BASE_API_URL_INFO_COMISIONES}/informe/comisiones/tiposTransaccion`);
  return response.data;
}

export const fetchTransactions = async (payload) => {
  try {
    const response = await axios.post(`${VUE_APP_BASE_API_URL_INFO_COMISIONES }/informe/comisiones/detalle`, payload);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

  export const fetchTransactionsTotales = async (payload) => {
    try {
      const response = await axios.post(`${VUE_APP_BASE_API_URL_INFO_COMISIONES }/informe/comisiones/totales`, payload);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

