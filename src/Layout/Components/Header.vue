<template>
  <div :class="headerbg" class="app-header header-shadow">
    <div class="logo-srcx" />
    <div class="app-header__content">
      <!-- <div class="app-header-left" v-if="data1!='localespos'">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <b-dropdown toggle-class="p-0 mr-2" menu-class="dropdown-menu-lg" variant="link" no-caret right>
                <span slot="button-content"> 
                  <span
                    v-bind="attrs"
                    v-on="on"
                  >
                  <img width="32" class="rounded-circle" src="@/assets/images/avatars/icons8-circular-arrows-48.png" @click.prevent="output1" /></span>
                </span>
              </b-dropdown>
              </template>
              <span>Actualizar</span>
          </v-tooltip>
      </div> -->
      <div class="app-header-left">
        <UserInfo />
        <!-- <div class="compilation-info-container">
          <div class="compilation-info">
            <p>Fecha de Compilación: {{ dateCompilation }} Versión: {{ version }}</p>
          </div>
        </div> -->
      </div>

      <div class="app-header-right">
<!--    <HeaderDots /> -->
<!--    <MegaMenu /> -->
    <UserArea /> 
      </div>
    </div>
    <div class="app-header__mobile-menu">
      <div>
        <button type="button" class="hamburger close-sidebar-btn hamburger--elastic"
          v-bind:class="{ 'is-active' : isOpen }" @click="toggleMobile('closed-sidebar-open')">
          <span class="hamburger-box">
            <span class="hamburger-inner"></span>
          </span>
        </button>
      </div>
    </div>
    <div class="app-header__menu">
      <span>
        <b-button class="btn-icon btn-icon-only" variant="primary" size="sm"
          v-bind:class="{ 'active' : isOpenMobileMenu }" @click="toggleMobile2('header-menu-open')">
          <div class="btn-icon-wrapper">
            <font-awesome-icon icon="ellipsis-v" />
          </div>
        </b-button>
      </span>
    </div>
  </div>
</template>

<script>
//import SearchBox from "./Header/SearchBox";
//import MegaMenu from "./Header/MegaMenu";
//import HeaderDots from "./Header/HeaderDots";
import UserArea from "./Header/HeaderUserArea";
import UserInfo from "./Header/HeaderUserInfo.vue";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faEllipsisV);
export default {
  name: "Header",
  components: {
//    SearchBox,
//    MegaMenu,
//    HeaderDots,
    UserArea,
    UserInfo,
    "font-awesome-icon": FontAwesomeIcon
  },

  data() {
    return {
      isOpen: false,
      isOpenMobileMenu: false,
      data1: ""
    };
  },
  props: {
    headerbg: String
  },

  created() {
    this.initialize();
  },

  methods: {
    toggleMobile(className) {
      const el = document.body;
      this.isOpen = !this.isOpen;

      if (this.isOpen) {
        el.classList.add(className);
      } else {
        el.classList.remove(className);
      }
    },

    toggleMobile2(className) {
      const el = document.body;
      this.isOpenMobileMenu = !this.isOpenMobileMenu;

      if (this.isOpenMobileMenu) {
        el.classList.add(className);
      } else {
        el.classList.remove(className);
      }
    },

    initialize(){
      this.data1 = JSON.parse(localStorage.getItem('loginData'));
    },

    async output1() {  
      this.data1 = JSON.parse(localStorage.getItem('loginData'));
      if (this.data1==="localespos"){
        this.$router.push("/Dashboards/listalocales");
      } else {
        this.$router.push("/Dashboards/Analytics");
      }  
    }
  }
};
</script>