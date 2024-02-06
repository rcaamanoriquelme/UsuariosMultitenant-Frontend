import axios from 'axios';

import config from '../../config.js';  

const VUE_APP_BASE_API_URL_VALES = config.VUE_APP_BASE_API_URL_VALES;

export default { 
  
async fetchVales (payload)  {
  try {
    const response = await axios.post(`${VUE_APP_BASE_API_URL_VALES}/informe/vales`, payload);
    return response;
  } catch (error) {
    console.error('Hubo un error al buscar los vales:', error);
    throw error;
  }
},

async fetchVales2 (payload)  {
  try {
    const response = await axios.post(`${VUE_APP_BASE_API_URL_VALES}/informe/vales2`, payload);
    return response;
  } catch (error) {
    console.error('Hubo un error al buscar los vales:', error);
    throw error;
  }
},

async fetchVales3 (payload)  {
  try {
    const response = await axios.post(`${VUE_APP_BASE_API_URL_VALES}/informe/vales3`, payload);
    return response;
  } catch (error) {
    console.error('Hubo un error al buscar los vales:', error);
    throw error;
  }
},

async fetchComercio (payload)  {
  try {
    const response = await axios.get(`${VUE_APP_BASE_API_URL_VALES}/informe/comercios`, payload);
    return response;
  } catch (error) {
    console.error('Hubo un error al buscar los vales:', error);
    throw error;
  }
}

}
