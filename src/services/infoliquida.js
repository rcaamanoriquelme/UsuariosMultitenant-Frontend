import axios from 'axios';
import config from '../../config.js';  

const VUE_APP_BASE_API_URL_INFO_LIQUIDA = config.VUE_APP_BASE_API_URL_INFO_LIQUIDA;

export default {
 async fetchBanks() {
  const response = await axios.get(`${VUE_APP_BASE_API_URL_INFO_LIQUIDA}/informe/bancos`);
  return response.data;
},

async fetchAccounts(selectedBank) {
  if(selectedBank) {
    const response = await axios.get(`${VUE_APP_BASE_API_URL_INFO_LIQUIDA}/informe/cuenta?id_banco=${selectedBank}`);
    return response.data;
  } else {
    return [];
  }
  
},
  async fetchTransactions(payload) {
    if(payload) {
      const response = await axios.post(`${VUE_APP_BASE_API_URL_INFO_LIQUIDA}/informe/liquidacion`,payload);
      return response.data;
    } else {
      return [];
    }
},

  async fetchOperators(id_issuer) {
    const response = await axios.get(`${VUE_APP_BASE_API_URL_INFO_LIQUIDA}/informe/operadores?id_emisor=${id_issuer}`);
    return response.data;
  },

  async fetchIssuers() {
    const response = await axios.get(`${VUE_APP_BASE_API_URL_INFO_LIQUIDA}/informe/emisores`);
    return response.data;

  },

  async fetchDetails(payload) {
    const response = await axios.post(`${VUE_APP_BASE_API_URL_INFO_LIQUIDA}/informe/detalle`,payload);
    return response;

  },

  async liqEmisores(payload) {
    const response = await axios.post(`${VUE_APP_BASE_API_URL_INFO_LIQUIDA}/informe/liqemisores`,payload);
    return response;

  },

  async fetchAsientoO(payload) {
    const response = await axios.post(`${VUE_APP_BASE_API_URL_INFO_LIQUIDA}/informe/montoasientoO`,payload);
    return response;

  },
  async fetchAsientoW(payload) {
    const response = await axios.post(`${VUE_APP_BASE_API_URL_INFO_LIQUIDA}/informe/montoasientoW`,payload);
    return response;

  }
  ,
  async fetchAsientoQR(payload) {
    const response = await axios.post(`${VUE_APP_BASE_API_URL_INFO_LIQUIDA}/informe/montoasientoQR`,payload);
    return response;

  }
};
