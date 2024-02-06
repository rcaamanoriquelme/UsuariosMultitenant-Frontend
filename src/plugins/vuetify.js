import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import es from 'vuetify/es5/locale/es';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        primary: '#3f6ad8',
        secondary: '#444054',
        accent: '#794c8a',
        error: '#d92550',
        info: '#78C3FB',
        success: '#3ac47d',
        warning: '#f7b924'
    },
    options: {
        customProperties: true
    },
    lang: {
        locales: { es },
        current: 'es',
      },
    iconfont: 'md' || 'mdi',
})
