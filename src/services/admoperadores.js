import axios from "axios";
import config from '../../config.js'; 

const BASE_API_URL = config.VUE_APP_BASE_API_URL_CONSULTA_TRANSACCIONES;

export async function getOperadores() {
  try {
    const response = await axios.get(`${BASE_API_URL}/api/operadores`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener operadores:', error);
    throw error;
  }
}

export async function getOperador(id) {
  try {
    const response = await axios.get(`${BASE_API_URL}/api/operadores/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener operador:', error);
    throw error;
  }
}

export async function guardarOperador(operador) {
  try {
    const response = await axios.post(`${BASE_API_URL}/api/operadores`, operador);
    return response.data;
  } catch (error) {
    console.error('Error al guardar operador:', error);
    throw error;
  }
}

export async function updateOperador(id, operador) {
  try {
    const response = await axios.put(`${BASE_API_URL}/api/operadores/${id}`, operador);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar operador:', error);
    throw error;
  }
}

export async function deleteOperador(id) {
  try {
    const response = await axios.delete(`${BASE_API_URL}/api/operadores/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar operador:', error);
    throw error;
  }
}