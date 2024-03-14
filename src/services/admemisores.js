import axios from "axios";
import config from '../../config.js';

const BASE_API_URL = config.VUE_APP_BASE_API_URL_CONSULTA_TRANSACCIONES;

export async function getEmisores() {
  try {
    const response = await axios.get(`${BASE_API_URL}/api/emisores`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener emisores:', error);
    throw error;
  }
}

export async function getEmisor(id) {
  try {
    const response = await axios.get(`${BASE_API_URL}/api/emisores/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener emisor:', error);
    throw error;
  }
}

export async function guardarEmisor(emisor) {
  try {
    const response = await axios.post(`${BASE_API_URL}/api/emisores`, emisor);
    return response.data;
  } catch (error) {
    console.error('Error al guardar emisor:', error);
    throw error;
  }
}

export async function updateEmisor(id, emisor) {
  try {
    const response = await axios.put(`${BASE_API_URL}/api/emisores/${id}`, emisor);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar emisor:', error);
    throw error;
  }
}

export async function deleteEmisor(id) {
  try {
    const response = await axios.delete(`${BASE_API_URL}/api/emisores/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar emisor:', error);
    throw error;
  }
}
