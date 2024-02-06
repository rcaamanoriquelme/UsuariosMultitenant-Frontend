<template>
    <div class="d-flex">
        <div class="compilation-info-container">
          <div class="compilation-info">
            <!-- <p>Fecha de Compilación: {{ dateCompilation }} Versión: {{ version }}</p> -->
            <p>{{ fechaActual }}</p>
          </div>
        </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        fechaActual: '',
        datos: '',
        rol: '',
        searchOpen: false
      };
    },
    created() {
        this.fechaActual = this.obtenerFechaHoraFormato();
    },
    methods: {
        obtenerFechaHoraFormato() {
            let fecha = new Date();

            let dia = fecha.getDate().toString().padStart(2, '0');
            let mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); // Enero es 0
            let año = fecha.getFullYear();
            let hora = fecha.getHours().toString().padStart(2, '0');
            let minuto = fecha.getMinutes().toString().padStart(2, '0');

            return `${dia}/${mes}/${año} ${hora}:${minuto}`;
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