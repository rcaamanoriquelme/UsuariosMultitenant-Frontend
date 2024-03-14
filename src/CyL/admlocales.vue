<template>
    <div>
      <!-- Agrega el botón para agregar local -->
      <router-link to="/CyL/admlocalsave">
        <v-btn color="primary" class="mb-2">Agregar Local</v-btn>
      </router-link>
      <v-data-table
        :headers="headers"
        :items="locales"
        :items-per-page="10"
        class="elevation-1"
      >
        <!-- Personaliza las columnas y el contenido según tus necesidades -->
        <template v-slot:item.actions="props">
          <td>
            <v-btn @click="openEditModal(props.item.id_local)" color="success" dark>Editar</v-btn>
            <v-btn @click="confirmarEliminarLocal(props.item)" color="red" dark>Eliminar</v-btn>
          </td>
          <!-- Agrega más columnas según las propiedades de tus locales -->
        </template>
      </v-data-table>
      <!-- Modal de Edición -->
      <v-dialog v-model="dialog" max-width="600">
        <template v-slot:activator="{ on }">
          <!-- Eliminado el botón y activador, ya que ahora se maneja con el router-link -->
        </template>
  
        <v-card>
          <v-card-title>
            <span class="headline">Editar Local</span>
          </v-card-title>
  
          <!-- Contenido del formulario de edición -->
          <v-card-text>
            <v-alert v-if="mostrarAlerta" type="error" outlined>
              {{ mensajeAlerta }}
            </v-alert>
            <v-form @submit.prevent="updateLocal">
              <!-- Aquí coloca los campos que deseas editar -->
              <!-- Ejemplo: -->
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field v-model="editedLocal.loc_nombre" label="Nombre del Local" required></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="editedLocal.loc_codsap" label="Código SAP" required></v-text-field>
                </v-col>
                <!-- Agrega más campos según las propiedades de local -->
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
            ¿Estás seguro de que quieres eliminar este local?
          </v-card-text>
          <v-card-actions>
            <v-btn @click="confirmDialog = false" color="blue darken-1" text>
              Cancelar
            </v-btn>
            <v-btn @click="eliminarLocal" color="red darken-1" text>
              Confirmar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </template>
  
  <script>
  import { getLocales, getLocal, deleteLocal } from "@/services/admlocales.js";
  import { updateLocal } from "@/services/admlocales.js";
  
  export default {
    data() {
      return {
        locales: [],
        headers: [
          { text: "ID Local", value: "id_local" },
          { text: "Nombre del Local", value: "loc_nombre" },
          { text: "Código SAP", value: "loc_codsap" },
          { text: "Fecha de Creación", value: "loc_fcrea" },
          { text: "Editar", value: "actions", sortable: false },
          // Agrega más headers según las propiedades de tus locales
        ],
        dialog: false,
        editedLocal: {
          // Propiedades del local que se está editando
          id_local: null,
          loc_nombre: "",
          loc_codsap: "",
          // Agrega más propiedades según tus necesidades
        },
        confirmDialog: false,
        localAEliminar: null,
        mostrarAlerta: false,
        mensajeAlerta: "", // Nuevo estado para almacenar el mensaje de alerta personalizado
      };
    },
    mounted() {
      this.fetchLocales();
    },
    methods: {
      async fetchLocales() {
        try {
          // Llama a la función getLocales desde admlocales.js
          this.locales = await getLocales();
        } catch (error) {
          console.error('Error fetching locales:', error);
          // Puedes manejar el error según tus necesidades (mostrar un mensaje de error, etc.)
        }
      },
      async openEditModal(localId) {
        try {
          // Llama a la función getLocal desde admlocales.js para obtener los detalles del local
          this.mostrarAlerta = false,
          this.mensajeAlerta = "", // Nuevo estado para almacenar el mensaje de alerta personalizado
          this.editedLocal = await getLocal(localId);
          this.dialog = true;
        } catch (error) {
          console.error('Error fetching local details:', error);
          // Puedes manejar el error según tus necesidades (mostrar un mensaje de error, etc.)
        }
      },
      closeEditModal() {
        // Lógica para cerrar el modal
        this.dialog = false;
      },
      async updateLocal() {
        if (!this.validarCamposEdicion()) {
          this.mostrarAlerta = true;
          return;
        }

        try {
          // Lógica para actualizar el local en el servidor
          await updateLocal(this.editedLocal.id_local, this.editedLocal);
          // Lógica adicional según tus necesidades (actualizar lista, mostrar mensaje, etc.)
          this.closeEditModal();
          this.fetchLocales(); // Asegúrate de tener el método fetchLocales en tu componente
        } catch (error) {
          console.error('Error updating local:', error);
          // Puedes manejar el error según tus necesidades (mostrar un mensaje de error, etc.)
        }
      },
      confirmarEliminarLocal(local) {
        this.localAEliminar = local;
        this.confirmDialog = true;
      },
      async eliminarLocal() {
        try {
          if (this.localAEliminar) {
            await deleteLocal(this.localAEliminar.id_local);
            this.fetchLocales();
            this.confirmDialog = false;
          }
        } catch (error) {
          console.error('Error al eliminar local:', error);
          // Puedes manejar el error según tus necesidades (mostrar un mensaje de error, etc.)
        }
      },
      validarCamposEdicion() {
        // Validar longitud de nombre y código SAP
        const nombreValido = this.editedLocal.loc_nombre.length <= 100;
        const codsapValido = this.editedLocal.loc_codsap.length <= 10;

        // Validar campos vacíos
        if (!this.editedLocal.loc_nombre || !this.editedLocal.loc_codsap) {
          this.mensajeAlerta = "Por favor, complete todos los campos obligatorios.";
          return false;
        }

        // Generar mensajes de error personalizados
        if (!nombreValido) {
          this.mensajeAlerta = "El nombre del local no debe ser mayor de 100 caracteres.";
        } else if (!codsapValido) {
          this.mensajeAlerta = "El código SAP del local no debe ser mayor de 10 caracteres.";
        } else {
          this.mensajeAlerta = ""; // Resetear el mensaje de alerta si todos los campos son válidos
        }

        return nombreValido && codsapValido && this.editedLocal.loc_nombre && this.editedLocal.loc_codsap;
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
    color: #2B81D5
  }
  
  .font-class-name1 * {
    font-size: 12px;
  }
  
  .v-autocomplete__content{
    font-size: 8px;
  }
  </style>
  