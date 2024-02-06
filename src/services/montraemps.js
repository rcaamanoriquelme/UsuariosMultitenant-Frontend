import axios from 'axios';
import config from '../../config.js';  

const VUE_APP_BASE_API_URL_MONITOR_ERROR_PAGO_SERVICIOS = config.VUE_APP_BASE_API_URL_MONITOR_ERROR_PAGO_SERVICIOS;

const Montraemps = {
  async fetchPaymentServiceErrors({ fechaInicio, fechaFinal }) {
    const response = await axios.post(
      `${VUE_APP_BASE_API_URL_MONITOR_ERROR_PAGO_SERVICIOS}/servicios/errores`,
      {
        fechaInicio: fechaInicio,
        fechaFinal: fechaFinal
      }
    );
    return response;
  },
  async fetchErrorDetail(id_page) {
    const response = await axios.get(`${VUE_APP_BASE_API_URL_MONITOR_ERROR_PAGO_SERVICIOS}/servicios/errores/detalle/${id_page}`);
    return response.data;
  },
};

export default Montraemps;
