import axios from 'axios';

const config = require('../../config.js')
const VUE_APP_BASE_API_URL_VENTAS_MENSUALES = config.VUE_APP_BASE_API_URL_VENTAS_MENSUALES;

export default {
  async fetchChains() {
    
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
          console.log(data);
      return data;
  },
  async fetchLocales(chainSelected) {
    return await axios.get(`${VUE_APP_BASE_API_URL_VENTAS_MENSUALES}/ventas/combobox/locales?cadena=${chainSelected}`);
  },
  async fetchEmitters() {
    return await axios.get(`${VUE_APP_BASE_API_URL_VENTAS_MENSUALES}/ventas/combobox/emisores`);
  },
  async fetchOperators(issuerSelected) {
    return await axios.get(`${VUE_APP_BASE_API_URL_VENTAS_MENSUALES}/ventas/combobox/operadores?emisor=${issuerSelected}`);
  },
  async fetchTransactions(payload) {
    return await axios.post(`${VUE_APP_BASE_API_URL_VENTAS_MENSUALES}/ventas/listar`, payload);
  },
};
