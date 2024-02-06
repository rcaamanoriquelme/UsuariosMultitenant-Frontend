<template>
    <div class="d-flex">
        <div class="compilation-info-container">
          <div class="compilation-info">
            <!-- <p>Fecha de Compilación: {{ dateCompilation }} Versión: {{ version }}</p> -->
            <p>Usuario {{ datos.usuLogin }} (Perfil: {{ datos.roles }})</p>
          </div>
        </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        datos: '',
        rol: '',
        searchOpen: false
      };
    },
    created() {
        const userData = JSON.parse(localStorage.getItem('userData'));
        console.log(userData);
        this.datos = userData;
    },
    methods: {
        async getInfoUsuario() {
            const userData = JSON.parse(localStorage.getItem('userData'));
            this.datos = userData;
            console.log(userData);
        }
    }
  };
  </script>
  
  <style scoped>
  .compilation-info {
    text-align: center;
  }
  .compilation-info-container {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%; 
    height: 100px; 
    font-size: small;
  }
  
  </style>