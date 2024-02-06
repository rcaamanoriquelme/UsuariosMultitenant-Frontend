import axios from 'axios';
import config from '../../config.js';  

const  VUE_APP_BASE_API_URL_VENTAS_MENSUALES = config. VUE_APP_BASE_API_URL_VENTAS_MENSUALES;
const VUE_APP_BASE_API_URL_INFO_COMISIONES = config.VUE_APP_BASE_API_URL_INFO_COMISIONES;
const VUE_APP_BASE_API_URL_PAGOS = config.VUE_APP_BASE_API_URL_PAGOS;

export const fetchChains = async () => {

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
};

export const fetchLocals = async (chainSelected) => {
  return await axios.get(`${VUE_APP_BASE_API_URL_VENTAS_MENSUALES}/ventas/combobox/locales?cadena=${chainSelected}`);
};

export const fetchIssuers = async () => {
  const response = await axios.get(`${VUE_APP_BASE_API_URL_VENTAS_MENSUALES}/ventas/combobox/emisores`);
  return response.data.map(issuer => ({ value: issuer.value, id: issuer.id }));
};

export const fetchTransactionTypes = async () => {
  const response = await axios.get(`${VUE_APP_BASE_API_URL_INFO_COMISIONES}/informe/comisiones/tiposTransaccion`);
  return response.data.map(type => type.ttx_nombre);
};

export const fetchPayments= async (payload) => {
  
  try {
    const response = await axios.post(`${VUE_APP_BASE_API_URL_PAGOS}/pagos/info`, payload);
    return response.data;
  } catch (error) {
    console.error(error);
  }


};
