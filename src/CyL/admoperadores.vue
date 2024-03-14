<template>
    <div>
      <!-- Agrega el botón para agregar operador -->
      <router-link to="/CyL/admoperadorsave">
        <v-btn color="primary" class="mb-2">Agregar Operador</v-btn>
      </router-link>
  
      <v-data-table
        :headers="headers"
        :items="operadores"
        :items-per-page="10"
        class="elevation-1"
      >
        <!-- Personaliza las columnas y el contenido según tus necesidades -->
        <template v-slot:item.actions="props">
          <td>
            <v-btn @click="openEditModal(props.item.idOperador)" color="success" dark>Editar</v-btn>
            <v-btn @click="confirmarEliminarOperador(props.item)" color="red" dark>Eliminar</v-btn>
          </td>
          <!-- Agrega más columnas según las propiedades de tus operadores -->
        </template>
      </v-data-table>
  
      <!-- Modal de Edición -->
      <v-dialog v-model="dialog" max-width="600">
        <v-card>
          <v-card-title>
            <span class="headline">Editar Operador</span>
          </v-card-title>
  
          <!-- Contenido del formulario de edición -->
          <v-card-text>
            <v-alert v-if="mostrarAlerta" type="error" outlined>
              {{ mensajeAlerta }}
            </v-alert>
            <v-form @submit.prevent="updateOperador">
              <!-- Aquí coloca los campos que deseas editar -->
              <!-- Ejemplo: -->
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field v-model="editedOperador.opeNombre" label="Nombre del Operador" required></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="editedOperador.opeCodigo" label="Código del Operador" required></v-text-field>
                </v-col>
                <!-- Agrega más campos según las propiedades de operador -->
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
            ¿Estás seguro de que quieres eliminar este operador?
          </v-card-text>
          <v-card-actions>
            <v-btn @click="confirmDialog = false" color="blue darken-1" text>
              Cancelar
            </v-btn>
            <v-btn @click="eliminarOperador" color="red darken-1" text>
              Confirmar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </template>
  
  <script>
  import { getOperadores, getOperador, deleteOperador } from "@/services/admoperadores.js";
  import { updateOperador } from "@/services/admoperadores.js";
  
  export default {
    data() {
      return {
        operadores: [],
        headers: [
          { text: "ID Operador", value: "idOperador" },
          { text: "Nombre del Operador", value: "opeNombre" },
          { text: "Código del Operador", value: "opeCodigo" },
          { text: "Fecha de Creación", value: "opeFcrea" },
          { text: "Editar", value: "actions", sortable: false },
          // Agrega más headers según las propiedades de tus operadores
        ],
        dialog: false,
        editedOperador: {
          // Propiedades del operador que se está editando
          idOperador: null,
          opeNombre: "",
          opeCodigo: "",
          // Agrega más propiedades según tus necesidades
        },
        confirmDialog: false,
        operadorAEliminar: null,
        mostrarAlerta: false,
        mensajeAlerta: "", // Nuevo estado para almacenar el mensaje de alerta personalizado
      };
    },
    mounted() {
      this.fetchOperadores();
    },
    methods: {
      async fetchOperadores() {
        try {
          // Llama a la función getOperadores desde admoperadores.js
          this.operadores = await getOperadores();
        } catch (error) {
          console.error('Error fetching operadores:', error);
          // Puedes manejar el error según tus necesidades (mostrar un mensaje de error, etc.)
        }
      },
      async openEditModal(operadorId) {
        try {
          // Llama a la función getOperador desde admoperadores.js para obtener los detalles del operador
          this.mostrarAlerta = false,
          this.mensajeAlerta = "", // Nuevo estado para almacenar el mensaje de alerta personalizado
          this.editedOperador = await getOperador(operadorId);
          this.dialog = true;
        } catch (error) {
          console.error('Error fetching operador details:', error);
          // Puedes manejar el error según tus necesidades (mostrar un mensaje de error, etc.)
        }
      },
      closeEditModal() {
        // Lógica para cerrar el modal
        this.dialog = false;
      },
      async updateOperador() {
        if (!this.validarCamposEdicion()) {
          this.mostrarAlerta = true;
          return;
        }

        try {
          // Lógica para actualizar el operador en el servidor
          await updateOperador(this.editedOperador.idOperador, this.editedOperador);
          // Lógica adicional según tus necesidades (actualizar lista, mostrar mensaje, etc.)
          this.closeEditModal();
          this.fetchOperadores(); // Asegúrate de tener el método fetchOperadores en tu componente
        } catch (error) {
          console.error('Error updating operador:', error);
          // Puedes manejar el error según tus necesidades (mostrar un mensaje de error, etc.)
        }
      },
      confirmarEliminarOperador(operador) {
        this.operadorAEliminar = operador;
        this.confirmDialog = true;
      },
      async eliminarOperador() {
        try {
          if (this.operadorAEliminar) {
            await deleteOperador(this.operadorAEliminar.idOperador);
            this.fetchOperadores();
            this.confirmDialog = false;
          }
        } catch (error) {
          console.error('Error al eliminar operador:', error);
          // Puedes manejar el error según tus necesidades (mostrar un mensaje de error, etc.)
        }
      },
      validarCamposEdicion() {
        // Validar longitud de código y nombre
        const codigoValido = this.editedOperador.opeCodigo.length <= 10;
        const nombreValido = this.editedOperador.opeNombre.length <= 100;

        // Validar campos vacíos
        if (!this.editedOperador.opeCodigo || !this.editedOperador.opeNombre) {
          this.mensajeAlerta = "Por favor, complete todos los campos obligatorios.";
          return false;
        }

        // Generar mensajes de error personalizados
        if (!codigoValido) {
          this.mensajeAlerta = "El código del operador no debe ser mayor de 10 caracteres.";
        } else if (!nombreValido) {
          this.mensajeAlerta = "El nombre del operador no debe ser mayor de 100 caracteres.";
        } else {
          this.mensajeAlerta = ""; // Resetear el mensaje de alerta si todos los campos son válidos
        }

        return codigoValido && nombreValido && this.editedOperador.opeCodigo && this.editedOperador.opeNombre;
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
  