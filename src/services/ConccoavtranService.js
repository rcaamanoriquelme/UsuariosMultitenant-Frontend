import axios from "axios";
import config from '../../config.js'; 

const BASE_API_URL = config.VUE_APP_BASE_API_URL_CONSULTA_TRANSACCIONES;

export async function getCadenas() {
  try {
        
    const userData = JSON.parse(localStorage.getItem('userData'));

    if (!userData || !userData.cadenas) {
        return []; 
    }

    return userData.cadenas.map(chain => {
        const [idCadena, cadNombre] = chain.split(',');
        return {
          idCadena,
          cadNombre
        };
    });
    
  } catch (error) {
    console.error('Error al obtener las cadenas:', error);
    throw error;
  }
}

export async function getLocales() {
  try {
    const response = await axios.get(`${BASE_API_URL}/api/conciliacion/medios-de-pago/consulta-transacciones/filtros/locales`);
    return response.data;
  } catch (error) {
    console.error('Error in getLocals:', error);
    throw error;
  }
}

export async function getLocalesByCadena(cadena) {
  try {
    const response = await axios.get(`${BASE_API_URL}/api/conciliacion/medios-de-pago/consulta-transacciones/filtros/localesbycadena/${cadena}`);
    return response.data;
  } catch (error) {
    console.error('Error in getLocalesByCadena:', error);
    throw error;
  }
}

export async function getEmisores() {
  try {
    const response = await axios.get(`${BASE_API_URL}/api/conciliacion/medios-de-pago/consulta-transacciones/filtros/emisores`);
    return response.data;
  } catch (error) {
    console.error('Error in getEmisores:', error);
    throw error;
  }
}

export async function getOperadoresByEmisor(emisor) {
  try {
    const response = await axios.get(`${BASE_API_URL}/api/conciliacion/medios-de-pago/consulta-transacciones/filtros/operadoresbyemisor/${emisor}`);
    return response.data;
  } catch (error) {
    console.error('Error in getOperadoresByEmisor:', error);
    throw error;
  }
}

export async function getTarjetasByEmisor(emisor) {
  try {
    const response = await axios.get(`${BASE_API_URL}/api/conciliacion/medios-de-pago/consulta-transacciones/filtros/tarjetasbyemisor/${emisor}`);
    return response.data;
  } catch (error) {
    console.error('Error in getTarjetasByEmisor:', error);
    throw error;
  }
}

export async function getTipoTrxByEmisor(emisor) {
  try {
    const response = await axios.get(`${BASE_API_URL}/api/conciliacion/medios-de-pago/consulta-transacciones/filtros/tipotrxbyemisor/${emisor}`);
    return response.data;
  } catch (error) {
    console.error('Error in getTipoTrxByEmisor:', error);
    throw error;
  }
}

export async function getEstadoConciliaciones() {
  try {
    const response = await axios.get(`${BASE_API_URL}/api/conciliacion/medios-de-pago/consulta-transacciones/filtros/estado-conciliacion`);
    return response.data;
  } catch (error) {
    console.error('Error in getEstadoConciliaciones:', error);
    throw error;
  }
}

export async function getEstadoLiquidaciones() {
  try {
    const response = await axios.get(`${BASE_API_URL}/api/conciliacion/medios-de-pago/consulta-transacciones/filtros/estado-liquidacion`);
    return response.data;
  } catch (error) {
    console.error('Error in getEstadoLiquidaciones:', error);
    throw error;
  }
}

export async function getConsultaTransaccionesByFiltro(filtro) {
  try {
    const response = await axios.post(`${BASE_API_URL}/api/conciliacion/medios-de-pago/consulta-transacciones/resumenbyfiltro`, filtro);
    return response.data;
  } catch (error) {
    console.error('Error in getConsultaTransaccionesByFiltro:', error);
    throw error;
  }
}

export async function getConsultaAvanzadaTransaccionesByFiltro(filtro) {
  try {
    const response = await axios.post(`${BASE_API_URL}/api/conciliacion/medios-de-pago/consulta-transacciones/resumenbyfiltroavanzado`, filtro);
    return response.data;
  } catch (error) {
    console.error('Error in getConsultaAvanzadaTransaccionesByFiltro:', error);
    throw error;
  }
}

export async function getAnotacionesByIdtrx(idtrx) {
  try {
    const response = await axios.get(`${BASE_API_URL}/api/conciliacion/medios-de-pago/consulta-transacciones/resumenbyfiltro/anotacionesbyidtrx/${idtrx}`);
    return response.data;
  } catch (error) {
    console.error('Error in getAnotacionesByIdtrx:', error);
    throw error;
  }
}

export async function getCambioEstadoTrxByIdtrx(idtrx) {
  try {
    const response = await axios.get(`${BASE_API_URL}/api/conciliacion/medios-de-pago/consulta-transacciones/resumenbyfiltro/cambioestadotrxbyidtrx/${idtrx}`);
    return response.data;
  } catch (error) {
    console.error('Error in getCambioEstadoTrxByIdtrx:', error);
    throw error;
  }
}

export async function getEstadoConciliacionDisponible(estado, emisor) {
  try {
    const response = await axios.get(`${BASE_API_URL}/api/conciliacion/medios-de-pago/consulta-transacciones/registroanotaciones/estadoconciliaciondisponibles/${estado}/${emisor}`);
    return response.data;
  } catch (error) {
    console.error('Error in getEstadoConciliacionDisponible:', error);
    throw error;
  }
}

export async function updateEstadoConciliacionTrx(listadoEstadoConciliacionTrx) {
  try {
    const response = await axios.put(`${BASE_API_URL}/api/conciliacion/medios-de-pago/consulta-transacciones/registroanotaciones/estadoconciliaciontrx/update`, listadoEstadoConciliacionTrx);
    return response.data;
  } catch (error) {
    console.error('Error in updateEstadoConciliacionTrx:', error);
    throw error;
  }
}

export async function saveAnotacionesTrx(listadoAnotacionesTrx) {
  try {
    const response = await axios.post(`${BASE_API_URL}/api/conciliacion/medios-de-pago/consulta-transacciones/registroanotaciones/anotacionestrx/save`, listadoAnotacionesTrx);
    return response.data;
  } catch (error) {
    console.error('Error in saveAnotacionesTrx:', error);
    throw error;
  }
}