<template>
  <v-container>
    <v-alert v-if="mostrarAlerta" type="error" outlined>
      {{ mensajeAlerta }}
    </v-alert>

    <v-form @submit.prevent="guardarEmisor">
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field v-model="emisor.emiCodigo" label="Código del Emisor" required></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field v-model="emisor.emiNombre" label="Nombre del Emisor" required></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field v-model="emisor.emiCodsap" label="Código SAP" required></v-text-field>
        </v-col>
      </v-row>

      <v-btn type="submit" color="primary">Guardar</v-btn>
    </v-form>
  </v-container>
</template>

<script>
import { guardarEmisor } from "@/services/admemisores";

export default {
  data() {
    return {
      emisor: {
        emiCodigo: "",
        emiNombre: "",
        emiCodsap: "",
        activo: "1",
        emiFcrea: new Date().toISOString().substr(0, 16),
        emiUcrea: "adm",
      },
      mostrarAlerta: false,
      mensajeAlerta: "", // Nuevo estado para almacenar el mensaje de alerta personalizado
    };
  },
  methods: {
    async guardarEmisor() {
      if (!this.validarCampos()) {
        this.mostrarAlerta = true;
        return;
      }

      try {
        await guardarEmisor(this.emisor);
        this.$router.push('/CYL/admemisores');
      } catch (error) {
        console.error("Error al guardar el emisor:", error);
      }
    },
    validarCampos() {
      // Validar longitud de código y nombre
      const codigoValido = this.emisor.emiCodigo.length <= 10;
      const codigoSapValido = this.emisor.emiCodsap.length <= 10;
      const nombreValido = this.emisor.emiNombre.length <= 100;

      // Validar campos vacíos
      if (!this.emisor.emiCodigo || !this.emisor.emiNombre || !this.emisor.emiCodsap) {
        this.mensajeAlerta = "Por favor, complete todos los campos obligatorios.";
        return false;
      }

      // Generar mensajes de error personalizados
      if (!codigoValido) {
        this.mensajeAlerta = "El código del emisor no debe ser mayor de 10 caracteres.";
      } else if (!nombreValido) {
        this.mensajeAlerta = "El nombre del emisor no debe ser mayor de 100 caracteres.";
      } else if (!codigoSapValido) {
        this.mensajeAlerta = "El código SAP del emisor no debe ser mayor de 100 caracteres.";
      } else {
        this.mensajeAlerta = ""; // Resetear el mensaje de alerta si todos los campos son válidos
      }

      return codigoValido && nombreValido && codigoSapValido && this.emisor.emiCodigo && this.emisor.emiNombre && this.emisor.emiCodsap;
      // Agrega más validaciones según tus necesidades
    },
  },
};
</script>