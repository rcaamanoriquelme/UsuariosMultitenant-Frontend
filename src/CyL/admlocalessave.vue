<template>
  <v-container>
    <v-alert v-if="mostrarAlerta" type="error" outlined>
      {{ mensajeAlerta }}
    </v-alert>

    <v-form @submit.prevent="guardarLocal">
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field v-model="local.loc_codigo" label="Código del Local" required></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field v-model="local.loc_nombre" label="Nombre del Local" required></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field v-model="local.loc_codsap" label="Código SAP" required></v-text-field>
        </v-col>
      </v-row>

      <v-btn type="submit" color="primary">Guardar</v-btn>
    </v-form>
  </v-container>
</template>

<script>
import { guardarLocal } from "@/services/admlocales";

export default {
  data() {
    return {
      local: {
        loc_codigo: "",
        loc_nombre: "",
        loc_fcrea: new Date().toISOString().substr(0, 16),
        loc_ucrea: "adm",
        loc_codsap: "",
        idCadena: 1,
        activo: "9",
      },
      mostrarAlerta: false,
      mensajeAlerta: "",
    };
  },
  methods: {
    async guardarLocal() {
      if (!this.validarCampos()) {
        this.mostrarAlerta = true;
        return;
      }

      try {
        await guardarLocal(this.local);
        this.$router.push('/CyL/admlocales');
      } catch (error) {
        console.error("Error al guardar el local:", error);
      }
    },
    validarCampos() {
      // Validar longitud de código y nombre
      const codigoValido = this.local.loc_codigo.length <= 10;
      const codigoSapValido = this.local.loc_codsap.length <= 10;
      const nombreValido = this.local.loc_nombre.length <= 100;

      // Validar campos vacíos
      if (!this.local.loc_codigo || !this.local.loc_nombre || !this.local.loc_codsap) {
        this.mensajeAlerta = "Por favor, complete todos los campos obligatorios.";
        return false;
      }

      // Generar mensajes de error personalizados
      if (!codigoValido) {
        this.mensajeAlerta = "El código del local no debe ser mayor de 10 caracteres.";
      } else if (!nombreValido) {
        this.mensajeAlerta = "El nombre del local no debe ser mayor de 100 caracteres.";
      } else if (!codigoSapValido) {
        this.mensajeAlerta = "El código SAP del local no debe ser mayor de 10 caracteres.";
      } else {
        this.mensajeAlerta = "";
      }

      return codigoValido && nombreValido && codigoSapValido && this.local.loc_codigo && this.local.loc_nombre && this.local.loc_codsap;
    },
  },
};
</script>

<style>
  .v-data-table.row-height1-30 td {
    font-size: 10px !important;
    height: 30px !important;
  }

  .font-class-name * {
    font-size: 12px;
  }

  .rdmqc {
    color: #2B81D5;
  }

  .font-class-name1 * {
    font-size: 12px;
  }

  .v-autocomplete__content {
    font-size: 8px;
  }
</style>
