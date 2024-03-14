import axios from "axios";
import config from '../../config.js'; 

const BASE_API_URL = config.VUE_APP_BASE_API_URL_CONSULTA_TRANSACCIONES;

export async function getLocales() {
  try {
    const response = await axios.get(`${BASE_API_URL}/api/locales`);
    return response.data;
  } catch (error) {
    console.error('Error in getLocals:', error);
    throw error;
  }
}

export async function getLocal(id) {
  try {
    const response = await axios.get(`${BASE_API_URL}/api/locales/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error in getLocal:', error);
    throw error;
  }
}

export async function guardarLocal(local) {
  try {
    const response = await axios.post(`${BASE_API_URL}/api/locales`, local);
    return response.data;
  } catch (error) {
    console.error('Error al guardar el local:', error);
    throw error;
  }
}

export async function updateLocal(id, local) {
  try {
    const response = await axios.put(`${BASE_API_URL}/api/locales/${id}`, local);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar el local:', error);
    throw error;
  }
}

export async function deleteLocal(id) {
  try {
    const response = await axios.delete(`${BASE_API_URL}/api/locales/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar el local:', error);
    throw error;
  }
}
