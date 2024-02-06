<template>
  <div class="d-flex"> <!-- Este div asegura que todo su contenido use flexbox -->
    <div class="compilation-info-container d-flex justify-content-between w-100"> <!-- Este contenedor alinea sus hijos a los extremos opuestos -->
      <!-- Fecha de Compilación y Versión (a la derecha) -->
      <div class="compilation-info">
        <p>Fecha de Compilación: {{ dateCompilation }} | Versión: {{ version }}</p>
      </div>
      
     </div>

    <div class="header-btn-lg pr-0">
      <div class="widget-content p-0">
        <div class="widget-content-wrapper">
          <div class="widget-content-left">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                  <b-dropdown toggle-class="p-0 mr-2" menu-class="dropdown-menu-lg" variant="link" no-caret right>
                    <span slot="button-content">
                      <div class="icon-wrapper icon-wrapper-alt rounded-circle">
                        <span
                          v-bind="attrs"
                          v-on="on"
                        >
                        <img width="32" alt="Salir" class="rounded-circle" src="@/assets/images/avatars/icons8-logout-rounded-64.png" @click.prevent="output1" /></span>
                      </div>
                    </span>
                  </b-dropdown>
              </template>
              <span>Salir</span>
            </v-tooltip> 
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import config from '../../../../config.js';
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faAngleDown,
  faCalendarAlt,
  faTrashAlt,
  faCheck,
  faFileAlt,
  faCloudDownloadAlt,
  faFileExcel,
  faFilePdf,
  faFileArchive,
  faEllipsisH
} from "@fortawesome/free-solid-svg-icons";

library.add(
  faAngleDown,
  faCalendarAlt,
  faTrashAlt,
  faCheck,
  faFileAlt,
  faCloudDownloadAlt,
  faFileExcel,
  faFilePdf,
  faFileArchive,
  faEllipsisH
);

export default {
  components: {},

  data: () => ({
    fill1: { gradient: ["#00b09b", "#96c93d"] },
    fill2: { gradient: ["#ff0844", "#ffb199"] },
    fill3: { gradient: ["#f6d365", "#fda085"] },
    showDrawerSection: false,
    dateCompilation: config.dateCompilation,
    version: config.version,
    userData: []
  }),

  computed: {
    formattedRoles() {
      return this.userData.roles ? this.userData.roles.join(', ') : '';
    }
  },

  methods: {
    async output1() {
      this.$router.push("/");
    },
    
    loadUserData() {
      const userDataString = localStorage.getItem('userData');
      if (userDataString) {
        this.userData = JSON.parse(userDataString);
        console.log(this.userData);
      }
    }
  },
  mounted() {
    this.loadUserData();
  },
};
</script>

<style scoped>
.compilation-info-container {
  margin-top: 20px;
  align-items: center; /* Alinea los elementos hijos verticalmente en el centro */
  font-size: small;
}

.user-info, .compilation-info {
  padding: 100px;
}
</style>