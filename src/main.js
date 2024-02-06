import Vue from 'vue'
import vuetify from './plugins/vuetify';
import router from './router'
import BootstrapVue from "bootstrap-vue"

import App from './App'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import Default from './Layout/Wrappers/baseLayout.vue';
import Pages from './Layout/Wrappers/pagesLayout.vue';
import Apps from './Layout/Wrappers/appLayout.vue';

import VueExcelXlsx from "vue-excel-xlsx";

import store from './store';
import axios from 'axios';

// Configurar interceptor de solicitud para añadir timestamp a las solicitudes GET
axios.interceptors.request.use(config => {

  const separator = config.url.indexOf('?') !== -1 ? '&' : '?';
  config.url += `${separator}timestamp=${new Date().getTime()}`;

  return config;
}, error => {
  return Promise.reject(error);
});

// Configurar interceptor de respuesta para manejar errores 401
axios.interceptors.response.use(undefined, function(error) {
  if (error) {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      store.dispatch("LogOut");
      return router.push("/login");
    }
  }
  return Promise.reject(error);
});

Vue.use(VueExcelXlsx);

Vue.config.productionTip = false;

Vue.use(BootstrapVue);

Vue.component('default-layout', Default);
Vue.component('userpages-layout', Pages);
Vue.component('apps-layout', Apps);

new Vue({
  el: '#app',
  store,
  router,
  vuetify,
  template: '<App/>',
  components: { App }
});
