import axios from "axios";
import config from '../../config.js'; 

const BASE_API_URL = config.VUE_APP_BASE_API_URL_CONSULTA_TRANSACCIONES;
const BASE_API_USER_URL = config.VUE_APP_BASE_API_USUARIOS;


export async function getUsuarios() {
  try {
    const storedUser = localStorage.getItem('user');

    if (!storedUser) {
      throw new Error('Token no encontrado en localStorage');
    }

    const token = JSON.parse(storedUser).token;

    console.log('Token:', token);

    const headers = {
      Authorization: `Bearer ${token}`
    };

    console.log('Headers:', headers);

    const response = await axios.get(`${BASE_API_USER_URL}/getAllUsuarios`, { headers });

    console.log('Response:', response.data);

    return response.data;
  } catch (error) {
    console.error('Error in getUsuarios:', error);
    throw error;
  }
}


export async function getUsuario(usuario) {
    const storedUser = localStorage.getItem('user');

    if (!storedUser) {
      throw new Error('Token no encontrado en localStorage');
    }
    const token = JSON.parse(storedUser).token;

    console.log('Token:', token);

    const headers = {
      Authorization: `Bearer ${token}`
    };
    try {
      const response = await axios.get(`${BASE_API_USER_URL}/getUsuario?usu_login=${usuario}&sistema=cyl`, { headers });
      return response.data;
    } catch (error) {
      console.error('Error in getLocals:', error);
      throw error;
    }
  }

  export async function getUsuarioCYR(usuario) {
    const storedUser = localStorage.getItem('user');

    if (!storedUser) {
      throw new Error('Token no encontrado en localStorage');
    }
    const token = JSON.parse(storedUser).token;

    console.log('Token:', token);

    const headers = {
      Authorization: `Bearer ${token}`
    };
    try {
      const response = await axios.get(`${BASE_API_USER_URL}/getUsuario?usu_login=${usuario}&sistema=cyr`, { headers });
      return response.data;
    } catch (error) {
      console.error('Error in getLocals:', error);
      throw error;
    }
  }

  export async function getUsuarioIFC(usuario) {
    const storedUser = localStorage.getItem('user');

    if (!storedUser) {
      throw new Error('Token no encontrado en localStorage');
    }
    const token = JSON.parse(storedUser).token;

    console.log('Token:', token);

    const headers = {
      Authorization: `Bearer ${token}`
    };
    try {
      const response = await axios.get(`${BASE_API_USER_URL}/getUsuario?usu_login=${usuario}&sistema=ifc`, { headers });
      return response.data;
    } catch (error) {
      console.error('Error in getLocals:', error);
      throw error;
    }
  }

  export async function guardarUsuario(usuario) {
    try {
      const response = await axios.post(`http://10.200.120.106:4041/api/auth/addUsuario`, usuario);
      return response.data;
    } catch (error) {
      console.error('Error al guardar el usuario:', error);
      throw error;
    }
  }

  export async function updateUsuario(usuario) {
    const storedUser = localStorage.getItem('user');

    if (!storedUser) {
      throw new Error('Token no encontrado en localStorage');
    }
    const token = JSON.parse(storedUser).token;

    console.log('Token:', token);

    const headers = {
      Authorization: `Bearer ${token}`
    };
    try {
      const response = await axios.put(`${BASE_API_USER_URL}/uppUsuario`, usuario, { headers });
      return response.data;
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
      throw error;
    }
  }

  export async function deleteUsuario(usuLogin) {
    const storedUser = localStorage.getItem('user');
  
    if (!storedUser) {
      throw new Error('Token no encontrado en localStorage');
    }
    const token = JSON.parse(storedUser).token;
  
    console.log('Token:', token);
  
    const headers = {
      Authorization: `Bearer ${token}`
    };
  
    try {
      // Construye el objeto JSON con la estructura deseada
      const data = {
        usuLogin,
        eliminado: "1"
      };
  
      // Envia la solicitud DELETE con el objeto JSON en el cuerpo
      const response = await axios.post(`${BASE_API_USER_URL}/delUsuario`, data, { headers });
      return response.data;
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
      throw error;
    }
  }

  export async function activeUsuario(usuLogin) {
    const storedUser = localStorage.getItem('user');
  
    if (!storedUser) {
      throw new Error('Token no encontrado en localStorage');
    }
    const token = JSON.parse(storedUser).token;
  
    console.log('Token:', token);
  
    const headers = {
      Authorization: `Bearer ${token}`
    };
  
    try {
      // Construye el objeto JSON con la estructura deseada
      const data = {
        usuLogin,
        eliminado: "0"
      };
  
      // Envia la solicitud DELETE con el objeto JSON en el cuerpo
      const response = await axios.post(`${BASE_API_USER_URL}/delUsuario`, data, { headers });
      return response.data;
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
      throw error;
    }
  }

  export async function getCYL(paCodigos, coCodigos) {
    try {
      const params = new URLSearchParams();
      
      paCodigos.forEach((paCodigo) => {
        params.append('paCodigos', paCodigo);
      });
  
      coCodigos.forEach((coCodigo) => {
        params.append('coCodigos', coCodigo);
      });
  
      const response = await axios.get(`${BASE_API_URL}/api/mpaiscomercio/paiscomercio?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error en getPaisComercio:', error);
      throw error;
    }
  }
  

  export async function getIFC(paCodigos, coCodigos) {
    try {
      const params = new URLSearchParams();
      
      paCodigos.forEach((paCodigo) => {
        params.append('paCodigos', paCodigo);
      });
  
      coCodigos.forEach((coCodigo) => {
        params.append('coCodigos', coCodigo);
      });
      const response = await axios.get(`${BASE_API_URL}/api/mpaiscomercio/paiscomercio?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error en getPaisComercio:', error);
      throw error;
    }
  }

  export async function getPComercio() {
    try {
      const response = await axios.get(`${BASE_API_URL}/api/maestro/paiscomercio`);
      return response.data;
    } catch (error) {
      console.error('Error en getPaisComercio:', error);
      throw error;
    }
  }

  export async function getPerfiles(sistema){
    try {
      const response = await axios.get(`${BASE_API_URL}/api/perfiles/sistema/${sistema}`);
      return response.data;
    } catch (error) {
      console.error('Error in getLocals:', error);
      throw error;
    }
  }

  export async function getCadenaLocal() {
    try {
      const response = await axios.get(`${BASE_API_URL}/api/maestro/getCadenaLocal`);
      return response.data;
    } catch (error) {
      console.error('Error en getCadenaLocal:', error);
      throw error;
    }
  }

  export async function getMonitorWeb(paCodigos, coCodigos) {
    try {
      const params = new URLSearchParams();
      
      paCodigos.forEach((paCodigo) => {
        params.append('paCodigos', paCodigo);
      });
  
      coCodigos.forEach((coCodigo) => {
        params.append('coCodigos', coCodigo);
      });
      const response = await axios.get(`${BASE_API_URL}/api/maestro/getComercioLocal?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error en getCadenaLocal:', error);
      throw error;
    }
  }

  export async function getCYR(paCodigos, coCodigos) {
    try {
      const params = new URLSearchParams();
      
      paCodigos.forEach((paCodigo) => {
        params.append('paCodigos', paCodigo);
      });
  
      coCodigos.forEach((coCodigo) => {
        params.append('coCodigos', coCodigo);
      });
      const response = await axios.get(`${BASE_API_URL}/api/maestro/getComercioLocal?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error en getCadenaLocal:', error);
      throw error;
    }
  }