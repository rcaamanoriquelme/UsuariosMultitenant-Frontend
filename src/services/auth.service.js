
import axios from 'axios';
import { loginURL as API_URL } from '../../config.js'; 

const login = (username, password) => {
  return axios
    .post(API_URL, {
      usu_login: username,
      usu_passwd: password,
      usu_sistema: 'cyl'
    })
    .then((response) => {
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }

      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};

export default {
  login,
};
