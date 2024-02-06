
import axios from 'axios';
import config from '../../config.js';  

const VUE_APP_BASE_API_URL_MONITOR_ERROR_MEDIOS_PAGO = config.VUE_APP_BASE_API_URL_MONITOR_ERROR_MEDIOS_PAGO;

const TransactionErrorService = {
  async fetchTransactionErrors(payload) {
    return await axios.post(`${VUE_APP_BASE_API_URL_MONITOR_ERROR_MEDIOS_PAGO}/transacciones/errores`, payload);
  },
  async fetchTransactionErrorsCsv(payload) {
    return await axios.post(`${VUE_APP_BASE_API_URL_MONITOR_ERROR_MEDIOS_PAGO}/transacciones/errores-csv`, payload);
  },
  async fetchTransactionDetail(id_trxe) {
    return await axios.get(`${VUE_APP_BASE_API_URL_MONITOR_ERROR_MEDIOS_PAGO}/transacciones/errores/${id_trxe}`);
  },
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
};

export default TransactionErrorService;
