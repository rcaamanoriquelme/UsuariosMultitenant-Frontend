
import axios from 'axios';
import config from '../../config.js';  

const VUE_APP_BASE_API_URL_MONITOR_ARCHIVOS = config.VUE_APP_BASE_API_URL_MONITOR_ARCHIVOS;

export default {

  async fetchInfo(payload) {
    return await axios.post(`${VUE_APP_BASE_API_URL_MONITOR_ARCHIVOS}/archivos/info`, payload);
  },
};
