<template>
  <div :class="sidebarbg" class="app-sidebar sidebar-shadow"
    @mouseover="toggleSidebarHover('add','closed-sidebar-open')" @mouseleave="toggleSidebarHover('remove','closed-sidebar-open')">
    <div class="app-header__logo">
      <div class="logo-src" />
      <div class="header__pane ml-auto">
        <button type="button" class="hamburger close-sidebar-btn hamburger--elastic"
          v-bind:class="{ 'is-active' : isOpen }" @click="toggleBodyClass('closed-sidebar')">
          <span class="hamburger-box">
            <span class="hamburger-inner"></span>
          </span>
        </button>
      </div>
    </div>


    <div class="app-sidebar-content">
      <VuePerfectScrollbar class="app-sidebar-scroll" v-once>
        <sidebar-menu showOneChild :menu="menus" />
      </VuePerfectScrollbar>
    </div>
    

  </div>
</template>

<script>
import { SidebarMenu } from "vue-sidebar-menu";
import VuePerfectScrollbar from "vue-perfect-scrollbar";

export default {
  components: {
    SidebarMenu,
    VuePerfectScrollbar,
  },
  data() {
    return {
      isOpen: true,
      sidebarActive: true,
      sidebarMenu: [],
      data1: "",
      collapsed: true,
      windowWidth: 0,
      menus: [
        {
          header: true,
          title: "Menu"
        },

        {
          href: "/CyL/admusuarios",
          title: "Usuarios",
          icon: "pe-7s-diamond",
        },
        {
          href: "/CyL/admemisores",
          title: "Emisores",
          icon: "pe-7s-diamond",
        },
        {
          href: "/CyL/admoperadores",
          title: "Operadores",
          icon: "pe-7s-diamond",
        },
        {
          href: "/CyL/admlocales",
          title: "Locales",
          icon: "pe-7s-diamond",
        }
      ]
    };
  },
  props: {
    sidebarbg: String,
  },

  methods: {
    removeItemByUrl(urlToRemove) {
    const removeItemFromChild = (child) => {
      for (let i = 0; i < child.length; i++) {
        if (child[i].href === urlToRemove) {
          child.splice(i, 1);
          return true; // Elemento encontrado y eliminado
        }
        if (child[i].child && removeItemFromChild(child[i].child)) {
          return true; // Elemento encontrado y eliminado en un nivel anidado
        }
      }
      return false; // Elemento no encontrado en este nivel
    };

    for (let i = 0; i < this.menus.length; i++) {
      if (this.menus[i].href === urlToRemove) {
        this.menus.splice(i, 1);
        return;
      }
      if (this.menus[i].child && removeItemFromChild(this.menus[i].child)) {
        return; // Elemento encontrado y eliminado en un nivel anidado
      }
    }
  },
  toggleBodyClass(className) {
    const el = document.body;
    this.isOpen = !this.isOpen;

    if (this.isOpen) {
      el.classList.add(className);
    } else {
      el.classList.remove(className);
    }
  },
  toggleSidebarHover(add, className) {
    const el = document.body;
    this.sidebarActive = !this.sidebarActive;

    this.windowWidth = document.documentElement.clientWidth;

    if (this.windowWidth > "992") {
      if (add === "add") {
        el.classList.add(className);
      } else {
        el.classList.remove(className);
      }
    }
  },
  getWindowWidth() {
    const el = document.body;

    this.windowWidth = document.documentElement.clientWidth;

    if (this.windowWidth < "1350") {
      el.classList.add("closed-sidebar", "closed-sidebar-md");
    } else {
      el.classList.remove("closed-sidebar", "closed-sidebar-md");
    }
  },

  
extractChildren(menu) {
  let extractedChildren = [];

  function processChild(child) {
    if (child.child) {
      extractedChildren.push(...child.child);
      child.child.forEach((subChild) => {
        processChild(subChild);
      });
    }
  }

  menu.forEach((item) => {
    processChild(item);
  });

  return extractedChildren;
  },

  findNonMatchingItems(childrenArray, secondArray) {
  const nonMatchingItems = [];
  //let  modifiedHref = '';
  childrenArray.forEach((child) => {
   
    const foundItem = secondArray.find(
      (item) => (("/CyL/"+item.mopUrl) === child.href ) && (item.mopNivel > 0)
    );

    if (!foundItem) {
          
          if(String(child.href) != "undefined")   {
          this.removeItemByUrl(child.href); 
          nonMatchingItems.push(child);
          console.log("No encontrado:", child.href);
          }  
    } 
    else {
      //console.log("Encontrado:", child.href);
    }
  });
  return nonMatchingItems;
  }
},

mounted() {
  const userData = JSON.parse(localStorage.getItem('userData'));
 
  let extractedChildren = this.extractChildren(this.menus);
  //console.log("extractedChildren menu: ", extractedChildren);

 this.findNonMatchingItems(
    extractedChildren,
    userData.menu
  );

  this.$nextTick(function () {
  window.addEventListener("resize", this.getWindowWidth);

    // Init
    this.getWindowWidth();
  });
},

beforeDestroy() {
  window.removeEventListener("resize", this.getWindowWidth);
},

};
</script>

<style>
  .app-sidebar-content {
    font-size: 14px;
  }
</style>
