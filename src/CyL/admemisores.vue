<template>
    <div>
      <!-- Agrega el botón para agregar emisor -->
      <router-link to="/CyL/admemisorsave">
        <v-btn color="primary" class="mb-2">Agregar Emisor</v-btn>
      </router-link>
  
      <v-data-table
        :headers="headers"
        :items="emisores"
        :items-per-page="10"
        class="elevation-1"
      >
        <!-- Personaliza las columnas y el contenido según tus necesidades -->
        <template v-slot:item.actions="props">
          <td>
            <v-btn @click="openEditModal(props.item.idEmisor)" color="success" dark>Editar</v-btn>
            <v-btn @click="confirmarEliminarEmisor(props.item)" color="red" dark>Eliminar</v-btn>
          </td>
          <!-- Agrega más columnas según las propiedades de tus emisores -->
        </template>
      </v-data-table>
  
      <!-- Modal de Edición -->
      <v-dialog v-model="dialog" max-width="600">
        <v-card>
          <v-card-title>
            <span class="headline">Editar Emisor</span>
          </v-card-title>
  
          <!-- Contenido del formulario de edición -->
          <v-card-text>
            <v-alert v-if="mostrarAlerta" type="error" outlined>
              {{ mensajeAlerta }}
            </v-alert>
            <v-form @submit.prevent="updateEmisor">
              <!-- Aquí coloca los campos que deseas editar -->
              <!-- Ejemplo: -->
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field v-model="editedEmisor.emiNombre" label="Nombre del Emisor" required></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="editedEmisor.emiCodigo" label="Código del Emisor" required></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="editedEmisor.emiCodsap" label="Código SAP" required></v-text-field>
                </v-col>
                <!-- Agrega más campos según las propiedades de emisor -->
              </v-row>
  
              <v-card-actions>
                <v-btn color="blue darken-1" text @click="closeEditModal">
                  Cancelar
                </v-btn>
                <v-btn color="blue darken-1" text type="submit">
                  Guardar Cambios
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>
  
      <v-dialog v-model="confirmDialog" max-width="400">
        <v-card>
          <v-card-title class="headline">
            Confirmar Eliminación
          </v-card-title>
          <v-card-text>
            ¿Estás seguro de que quieres eliminar este emisor?
          </v-card-text>
          <v-card-actions>
            <v-btn @click="confirmDialog = false" color="blue darken-1" text>
              Cancelar
            </v-btn>
            <v-btn @click="eliminarEmisor" color="red darken-1" text>
              Confirmar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </template>
  
  <script>
  import { getEmisores, getEmisor, deleteEmisor } from "@/services/admemisores.js";
  import { updateEmisor } from "@/services/admemisores.js";
  
  export default {
    data() {
      return {
        emisores: [],
        headers: [
          { text: "ID Emisor", value: "idEmisor" },
          { text: "Nombre del Emisor", value: "emiNombre" },
          { text: "Código del Emisor", value: "emiCodigo" },
          { text: "Fecha de Creación", value: "emiFcrea" },
          { text: "Editar", value: "actions", sortable: false },
          // Agrega más headers según las propiedades de tus emisores
        ],
        dialog: false,
        editedEmisor: {
          // Propiedades del emisor que se está editando
          idEmisor: null,
          emiNombre: "",
          emiCodigo: "",
          emiCodsap: "",
          activo: "1", // Valor predeterminado para el campo activo
          emiFmod: new Date().toISOString().substr(0, 16), // Puedes utilizar un date picker para esto
          emiUmod: "adm",
          // Agrega más propiedades según tus necesidades
        },
        confirmDialog: false,
        emisorAEliminar: null,
        mostrarAlerta: false,
        mensajeAlerta: "", // Nuevo estado para almacenar el mensaje de alerta personalizado
      };
    },
    mounted() {
      this.fetchEmisores();
    },
    methods: {
      async fetchEmisores() {
        try {
          // Llama a la función getEmisores desde admemisores.js
          this.emisores = await getEmisores();
        } catch (error) {
          console.error('Error fetching emisores:', error);
          // Puedes manejar el error según tus necesidades (mostrar un mensaje de error, etc.)
        }
      },
      async openEditModal(emisorId) {
        try {
          // Llama a la función getEmisor desde admemisores.js para obtener los detalles del emisor
          this.mostrarAlerta = false,
          this.mensajeAlerta = "", // Nuevo estado para almacenar el mensaje de alerta personalizado
          this.editedEmisor = await getEmisor(emisorId);
          this.dialog = true;
        } catch (error) {
          console.error('Error fetching emisor details:', error);
          // Puedes manejar el error según tus necesidades (mostrar un mensaje de error, etc.)
        }
      },
      closeEditModal() {
        // Lógica para cerrar el modal
        this.dialog = false;
      },
      async updateEmisor() {
        if (!this.validarCamposEdicion()) {
          this.mostrarAlerta = true;
          return;
        }

        try {
          // Lógica para actualizar el emisor en el servidor
          await updateEmisor(this.editedEmisor.idEmisor, this.editedEmisor);
          // Lógica adicional según tus necesidades (actualizar lista, mostrar mensaje, etc.)
          this.closeEditModal();
          this.fetchEmisores(); // Asegúrate de tener el método fetchEmisores en tu componente
        } catch (error) {
          console.error('Error updating emisor:', error);
          // Puedes manejar el error según tus necesidades (mostrar un mensaje de error, etc.)
        }
      },
      confirmarEliminarEmisor(emisor) {
        this.emisorAEliminar = emisor;
        this.confirmDialog = true;
      },
      async eliminarEmisor() {
        try {
          if (this.emisorAEliminar) {
            await deleteEmisor(this.emisorAEliminar.idEmisor);
            this.fetchEmisores();
            this.confirmDialog = false;
          }
        } catch (error) {
          console.error('Error al eliminar emisor:', error);
          // Puedes manejar el error según tus necesidades (mostrar un mensaje de error, etc.)
        }
      },
      validarCamposEdicion() {
        // Validar longitud de código y nombre
        const codigoValido = this.editedEmisor.emiCodigo.length <= 10;
        const codigoSapValido = this.editedEmisor.emiCodsap.length <= 10;
        const nombreValido = this.editedEmisor.emiNombre.length <= 100;

        // Validar campos vacíos
        if (!this.editedEmisor.emiCodigo || !this.editedEmisor.emiNombre || !this.editedEmisor.emiCodsap) {
          this.mensajeAlerta = "Por favor, complete todos los campos obligatorios.";
          return false;
        }

        // Generar mensajes de error personalizados
        if (!codigoValido) {
          this.mensajeAlerta = "El código del emisor no debe ser mayor de 10 caracteres.";
        } else if (!nombreValido) {
          this.mensajeAlerta = "El nombre del emisor no debe ser mayor de 100 caracteres.";
        } else if (!codigoSapValido) {
          this.mensajeAlerta = "El código SAP del emisor no debe ser mayor de 10 caracteres.";
        } else {
          this.mensajeAlerta = ""; // Resetear el mensaje de alerta si todos los campos son válidos
        }

        return codigoValido && nombreValido && codigoSapValido && this.editedEmisor.emiCodigo && this.editedEmisor.emiNombre && this.editedEmisor.emiCodsap;
        // Agrega más validaciones según tus necesidades
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
  