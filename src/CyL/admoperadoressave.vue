<template>
  <v-container>
    <v-alert v-if="mostrarAlerta" type="error" outlined>
      {{ mensajeAlerta }}
    </v-alert>

    <v-form @submit.prevent="guardarOperador">
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field v-model="operador.opeCodigo" label="Código del Operador" required></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-select
            v-model="operador.idEmisor"
            :items="emisores"
            item-text="emiNombre"
            item-value="idEmisor"
            label="Emisor"
            required
          ></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field v-model="operador.opeNombre" label="Nombre del Operador" required></v-text-field>
        </v-col>
      </v-row>

      <v-btn type="submit" color="primary">Guardar</v-btn>
    </v-form>
  </v-container>
</template>

<script>
import { guardarOperador } from "@/services/admoperadores";
import { getEmisores } from "@/services/admemisores";

export default {
  data() {
    return {
      operador: {
        opeCodigo: "",
        opeNombre: "",
        idEmisor: null,
        opeFcrea: new Date().toISOString().substr(0, 16),
        opeUcrea: "adm",
      },
      emisores: [],
      mostrarAlerta: false,
      mensajeAlerta: "",
    };
  },
  async created() {
    try {
      this.emisores = await getEmisores();
    } catch (error) {
      console.error("Error al obtener la lista de emisores:", error);
    }
  },
  methods: {
    async guardarOperador() {
      if (!this.validarCampos()) {
        this.mostrarAlerta = true;
        return;
      }

      try {
        await guardarOperador(this.operador);
        this.$router.push('/CyL/admoperadores');
      } catch (error) {
        console.error("Error al guardar el operador:", error);
      }
    },
    validarCampos() {
      // Validar longitud de código y nombre
      const codigoValido = this.operador.opeCodigo.length <= 10;
      const emisorValido = this.operador.idEmisor !== null;
      const nombreValido = this.operador.opeNombre.length <= 100;

      // Validar campos vacíos
      if (!this.operador.opeCodigo || !this.operador.idEmisor || !this.operador.opeNombre) {
        this.mensajeAlerta = "Por favor, complete todos los campos obligatorios.";
        return false;
      }

      // Generar mensajes de error personalizados
      if (!codigoValido) {
        this.mensajeAlerta = "El código del operador no debe ser mayor de 10 caracteres.";
      } else if (!emisorValido) {
        this.mensajeAlerta = "Por favor, seleccione un emisor.";
      } else if (!nombreValido) {
        this.mensajeAlerta = "El nombre del operador no debe ser mayor de 100 caracteres.";
      } else {
        this.mensajeAlerta = "";
      }

      return codigoValido && emisorValido && nombreValido && this.operador.opeCodigo && this.operador.idEmisor && this.operador.opeNombre;
    },
  },
};
</script>