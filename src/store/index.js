import Vuex from "vuex";
import Vue from "vue";
import axios from 'axios';
import commonData from './commonData';
// Load Vuex
Vue.use(Vuex);

//const LOGIN_URL = 'https://api.jsonbin.io/b/600c24d5a3d8a0580c3532b1';
//const MOBILES_URL = 'https://api.jsonbin.io/b/600c2479a3d8a0580c353296';
const LOGIN_URL = "https://reqres.in/api/";
const MOBILES_URL = "https://jsonplaceholder.typicode.com/users/1";
//const LOGIN_URL = "https://jsonplaceholder.typicode.com/";


// Create store
export default new Vuex.Store({

  modules: {
    commonData,
  },
  state: {
    token:'',
    mobiles:[]
  },
  mutations: {
    setMobiles(state, mobiles) {
      state.mobiles = mobiles;
    },
    setToken(state, t) {
      state.token = t;
    }
  },
  actions: {
    loadMobiles(context) {
      axios.get(MOBILES_URL,
        {
          headers: {
            'Authorization': 'bearer '+context.state.token
          }
        })
      .then(res => {
        context.commit('setMobiles', res.data);
      })
      .catch(error => {
        console.error(error);
      });
    },
    async loginSI(context, credentials) {
      console.log("Credenciales: ",credentials);
      const params = {
        email: credentials.parameters.email,
        password: credentials.parameters.password
      };
      console.log("Params: ",params);
      return axios.post(LOGIN_URL + "login", params)
      .then(res => {
        context.commit('setToken', res.data.token);
        console.log("Token: ",res.data.token);
        return true;
      })
      .catch(error => {
//        console.log("Params e: ",params);
        console.error(error);
      });  
    },
    async login(context, credentials) {
      console.log("Credenciales: ",credentials);

      let email1="eve.holt@reqres.in";
      let password1="cityslicka";

      const user = { email1, password1 };
      console.log("Params 1: ",user);
      return axios.post(LOGIN_URL + "login", user)
      .then(res => {
        console.log("Params 2: ",user);
        context.commit('setToken', res.data.token);
        console.log("Token: ",res);
        return true;
      })
      .catch(error => {
        console.log("Params e: ",user);
        console.error(error);
      });  
    },
    async loginOTROSI(context, credentials) {
      console.log("Credenciales: ",credentials);
      return axios.get(MOBILES_URL)
      .then(res => {
//        context.commit('setToken', res.data.token);
        console.log("Token: ",res);
        return true;
      })
      .catch(error => {
        console.log("Params e: ", this.params);
        console.error(error);
      });  
    }
  }
})
