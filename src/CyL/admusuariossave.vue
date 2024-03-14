<template>
  <v-container>
    <v-alert v-if="mostrarAlerta" type="error" outlined>
      {{ alertaMensaje }}
    </v-alert>

    <v-form @submit.prevent="guardarUsuario">
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field v-model="usuario.usuLogin" label="Usuario" required></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field v-model="usuario.usuPassword" label="Contraseña" type="password" required></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field v-model="usuario.usuPasswdRepeat" label="Repetir Contraseña" type="password" required></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field v-model="usuario.usuNombre" label="Nombre" required></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field v-model="usuario.usuApellido" label="Apellido" required></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field v-model="usuario.usuMail" label="Correo Electrónico" required></v-text-field>
        </v-col>    
        <v-col cols="12" md="6">
          <v-text-field v-model="usuario.usuRut" label="RUT" required></v-text-field>
        </v-col>   
        <v-col cols="6" md="6">
          <v-checkbox v-model="usuario.activo" label="Activo" name="1"></v-checkbox>
        </v-col>
      </v-row>
      <v-divider></v-divider>
      <v-card>
      <v-card-title>País + Comercio</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-row align="center">
          
          <v-col cols="12">
            <div class="checkbox-container" style="max-height: 300px; overflow-y: auto;">
              <v-checkbox
                v-for="opcion in opcionesPaisComercioCadena"
                :key="opcion.id"
                :value="opcion.sistemaCod"
                :label="opcion.sistemaCyl"
                v-model="selectedOptions"
              ></v-checkbox>
            </div>
          </v-col>
          <v-divider></v-divider>
          <v-col cols="12">
            <v-btn @click="toggleSelectAll" color="primary">Seleccionar todo</v-btn>
          </v-col>
        </v-row>
        
      </v-card-text>
    </v-card>
    <v-divider></v-divider>
    <v-row>
  <v-col cols="12" md="6">
    <v-select
      v-model="sistemaSeleccionado"
      :items="sistemas"
      item-value="value"
      item-text="name"
      label="Seleccione sistema"
      required
      dense
      @change="cargarPaisComercio"
    ></v-select>
  </v-col>
</v-row>
      <v-divider></v-divider>
      <v-row>
        <v-col cols="6" md="6">
          <v-card>
            <v-card-title>{{tituloSistemaCombinacion}}</v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              
              <v-row>
                <!-- Checkbox para Cadena Local -->
                <v-col cols="12">
                  <div class="checkbox-container" style="max-height: 300px; overflow-y: auto;">
                    <v-checkbox
                      v-for="opcion in opcionesCadenaLocal"
                      :key="opcion.id"
                      :value="opcion.sistemaCod"
                      :label="opcion.sistemaCyl"
                      v-model="selectedCadenaLocal[sistemaSeleccionado]"
                    ></v-checkbox>
                  </div>
                </v-col>
                <v-divider></v-divider>
                <v-col cols="12">
                  <v-btn @click="toggleSelectAllCadenaLocal" color="primary">Seleccionar Todo</v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="6" md="6">
          <!-- v-card para Super Usuario, Administrador y Tesorero -->
          <v-card>
            <v-card-title>Roles</v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <v-row>
                <!-- Checkbox para Roles -->
                <v-col cols="12" v-for="perfil in perfiles" :key="perfil.codigo">
                  <v-checkbox
                    v-model="selectedRoles[sistemaSeleccionado]"
                    :label="perfil.perNombre"
                    :value="perfil.perCodigo"
                  ></v-checkbox>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-btn @click="toggleSelectAllRoles" color="primary">Seleccionar Todo</v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-divider></v-divider>
      <v-btn type="submit" color="primary">Guardar</v-btn>
    </v-form>
  </v-container>
</template>

<script>
import { getCYL, getIFC, getPerfiles, guardarUsuario, getPComercio, getCYR, getMonitorWeb } from "@/services/admusuarios";

export default {
  data() {
    return {
      selectedOptions: [], // Cambia aquí
      sistemaSeleccionado: "",
      usuario: {
        usuLogin: "",
        usuPassword: "",
        usuPasswdRepeat: "",
        usuNombre: "",
        usuApellido: "",
        usuMail: "",
        usuLoginCrea: "admin",
        activo: "",
        usuBloqueado: "N",
        usuRut:"",
        usuIntentos: "1",
        sistemaInfo: []
      },
      opcionesPaisComercioCadena: [],
      sistemaOpcionesSeleccionadas: {},
      mostrarAlerta: false,
      tituloSistemaCombinacion: "",
      opcionesCadenaLocal: [],
      selectedRoles: {
        cyl: [],
        ifc: [],
        cyr: [],
        mow: [],
      },
      perfiles: [],
      selectedCadenaLocal: {
        cyl: [], // Inicializa como un array vacío
        ifc: [],
        cyr: [],
        mow: [],
      },
      sistemas: [
        { value: "cyl", name: "CYL" },
        { value: "cyr", name: "CYR" },
        { value: "ifc", name: "IFC" },
        { value: "mow", name: "Monitor Web" },
      ],
      alertaMensaje: "",
      selectedOptionsMemory: {}, // Almacena opciones seleccionadas por sistema en memoria
      selectedRolesMemory: {},   // Almacena roles seleccionados por sistema en memoria
    };
  },
  methods: {
    async guardarUsuario() {
      if (!this.validarCampos()) {
        return;
      }

      try {
        // Inicializa la propiedad sistemaInfo
        this.usuario.sistemaInfo = [];
        
        //Agrupa las opciones seleccionadas por sistema
        console.log(this.selectedRoles);
        const sistemasSeleccionados = this.sistemas.map(opcion => {
          return {
            sistema: opcion.value,
            roles: this.selectedRoles[opcion.value].map(rol => `${rol.toUpperCase()}`).join(','),
            locales: this.selectedCadenaLocal[opcion.value]
              .filter(local => local.sistemaCod === opcion.sistemaCod)
              .map(local => local)
              .join('@'),
            cadenas: this.selectedCadenaLocal[opcion.value]
              .filter(local => local.sistemaCod === opcion.sistemaCod)
              .map(local => local)
              .join('@'),
          };
        });

        // Convierte el array y asigna a sistemaInfo
        this.usuario.sistemaInfo = sistemasSeleccionados;
        this.usuario.activo = this.usuario.activo ? "1" : "0";
        delete this.usuario.sistema;
        delete this.usuario.usuPasswdRepeat;
        this.usuario.paisComercio = this.selectedOptions
              .map(local => local)
              .join('@'),

        // Llama a la función para guardar el usuario
        console.log("Pais Comercio: ", this.usuario.paisComercio);
        await guardarUsuario(this.usuario);
        this.$router.push('/CyL/admusuarios');
      } catch (error) {
        console.error("Error al guardar el usuario:", error);
      }
    },
    async cargarPerfiles() {
      try {
        if (this.sistemaSeleccionado) {
          console.log(this.sistemaSeleccionado);

          // Almacena los roles seleccionados actuales
          const rolesSeleccionadosAnteriores = this.selectedRoles[this.sistemaSeleccionado].slice();

          this.perfiles = await getPerfiles(this.sistemaSeleccionado);

          // Si hay roles anteriores y son válidos en el nuevo sistema, úsalos
          if (rolesSeleccionadosAnteriores.length > 0 && rolesSeleccionadosAnteriores.every(role => this.perfiles.some(perfil => perfil.perCodigo === role))) {
            this.selectedRoles[this.sistemaSeleccionado] = rolesSeleccionadosAnteriores;
          } else {
            // Agregar al array
            this.selectedRoles[this.sistemaSeleccionado] = rolesSeleccionadosAnteriores.slice(role =>
              this.perfiles.some(perfil => perfil.perCodigo === role)
            );
          }

          // Guarda los perfiles en localStorage
          localStorage.setItem('perfiles', JSON.stringify(this.perfiles));
          console.log(this.sistemaSeleccionado);
          // Guarda los roles seleccionados en localStorage solo si hay roles anteriores válidos
          if (this.selectedRoles.length > 0) {
            localStorage.setItem('selectedRoles', JSON.stringify(this.selectedRoles[this.sistemaSeleccionado]));
          } else {
            localStorage.removeItem('selectedRoles');
          }
        } else {
          // Limpiar los perfiles y los roles seleccionados si no hay sistema seleccionado
          this.perfiles = [];
          this.selectedRoles = [];
          localStorage.removeItem('perfiles');
          localStorage.removeItem('selectedRoles');
        }
      } catch (error) {
        console.error("Error al cargar perfiles:", error);
      }
    },


    validarCampos() {
      const camposFaltantes = [];

      console.log("usuario:", this.usuario);

      if (!this.usuario.usuLogin || this.usuario.usuLogin.length > 8) {
        camposFaltantes.push("Usuario debe tener menos de 8 caracteres");
      }
      if (!this.usuario.usuPassword) {
        camposFaltantes.push("Contraseña");
      }
      if (!this.usuario.usuPasswdRepeat) {
        camposFaltantes.push("Repetir Contraseña");
      }
      if (!this.usuario.usuNombre) {
        camposFaltantes.push("Nombre");
      }
      if (!this.usuario.usuApellido) {
        camposFaltantes.push("Apellido");
      }
      if (!this.usuario.usuMail || !this.validarEmail(this.usuario.usuMail)) {
        camposFaltantes.push("Correo Electrónico");
      }
      if (!this.usuario.usuRut || !this.validarRut(this.usuario.usuRut)) {
        camposFaltantes.push("RUT");
      }
      if (!this.sistemaSeleccionado) {
        camposFaltantes.push("Sistema");
      }
      if (this.selectedOptions.length === 0) {
        camposFaltantes.push("País + Comercio");
      }
      if (this.selectedCadenaLocal.length === 0) {
        camposFaltantes.push("País + Comercio + Cadena");
      }
      if (this.selectedRoles.length === 0) {
        camposFaltantes.push("Roles");
      }

      if(this.usuario.usuPassword !== this.usuario.usuPasswdRepeat){
        camposFaltantes.push("Contraseñas deben ser idénticas");
      }

      const letrasRegex = /^[A-Za-z]+$/;

      if (!letrasRegex.test(this.usuario.usuNombre)) {
        camposFaltantes.push("Nombre debe contener solo letras");
      }

      if (!letrasRegex.test(this.usuario.usuApellido)) {
        camposFaltantes.push("Apellido debe contener solo letras");
      }

      if (camposFaltantes.length > 0) {
        this.mostrarAlerta = true;

        // Muestra una alerta con los campos faltantes
        const camposFaltantesTexto = camposFaltantes.join(", ");
        this.alertaMensaje = `Por favor, complete los siguientes campos: ${camposFaltantesTexto}`;

        return false;
      }

      // Resto de la lógica

      return true;
    },
    validarEmail(email) {
      // Expresión regular para validar un correo electrónico
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },
    validarRut(rut) {
      // Expresión regular para validar un RUT sin puntos ni guiones y con un máximo de 9 caracteres numéricos
      const rutRegex = /^[1-9]\d{0,8}K?$/;
      return rutRegex.test(rut);
    },
    async cargarPrimerPanel(){
      this.opcionesPaisComercioCadena = await getPComercio();
    },
    async cargarPaisComercio() {
      try {
        const paCodigos = [];
        const coCodigos = [];
        this.usuario.sistema = this.sistemaSeleccionado;
        this.selectedOptions.forEach((opcion) => {
          const [pais, comercio] = opcion.split(',');
          paCodigos.push(parseInt(pais));
          coCodigos.push(parseInt(comercio));
        });
        
        if (this.usuario.sistema === "cyl") {
          this.opcionesCadenaLocal = await getCYL(paCodigos, coCodigos);
          this.tituloSistemaCombinacion = "Pais + Comercio + Cadena";
          //this.selectedOptionsMemory["cyl"] = this.selectedCadenaLocal["cyl"];
        } else if (this.usuario.sistema === "ifc") {
          this.opcionesCadenaLocal = await getIFC(paCodigos, coCodigos);
          this.tituloSistemaCombinacion = "Pais + Comercio + Cadena";
          //this.selectedOptionsMemory["ifc"] = this.selectedCadenaLocal["ifc"];
        } else if (this.usuario.sistema === "cyr") {
          this.opcionesCadenaLocal = await getCYR(paCodigos, coCodigos);
          this.tituloSistemaCombinacion = "Pais + Comercio + Local";
          //this.selectedOptionsMemory["cyr"] = this.selectedCadenaLocal["cyr"];
        }  
        else if (this.usuario.sistema === "mow") {
          this.opcionesCadenaLocal = await getMonitorWeb(paCodigos, coCodigos);
          this.tituloSistemaCombinacion = "Pais + Comercio + Local";
          //this.selectedOptionsMemory["mow"] = this.selectedCadenaLocal["mow"];
        }  else {
          this.tituloSistemaCombinacion = "Seleccione sistema...";
        }

        await this.cargarPerfiles();
        //localStorage.setItem('perfiles', JSON.stringify(this.perfiles));
        
      } catch (error) {
        console.error("Error al cargar opciones de País Comercio y Cadena Local:", error);
      }
    },
    toggleSelectAll() {
      if (this.selectedOptions.length === this.opcionesPaisComercioCadena.length) {
        // Si todas las opciones están seleccionadas, deseleccionar todas
        this.selectedOptions = [];
      } else {
        // Si algunas o ninguna opción está seleccionada, seleccionar todas
        this.selectedOptions = this.opcionesPaisComercioCadena.map(
          opcion => opcion.sistemaCod
        );
      }
    },
    toggleSelectAllCadenaLocal() {
      const sistemaSeleccionado = this.sistemaSeleccionado;

      console.log("Sistema Seleccionado:", sistemaSeleccionado);
      console.log("Selected Cadena Local:", this.selectedCadenaLocal[sistemaSeleccionado]);

      if (this.selectedCadenaLocal[sistemaSeleccionado].length === this.opcionesCadenaLocal.length) {
        this.selectedCadenaLocal[sistemaSeleccionado] = [];
      } else {
        this.selectedCadenaLocal[sistemaSeleccionado] = this.opcionesCadenaLocal.map(local => local.sistemaCod);
      }
    },

    toggleSelectAllRoles() {
      const sistemaSeleccionado = this.sistemaSeleccionado;

      if (this.selectedRoles[sistemaSeleccionado].length === this.perfiles.length) {
        this.selectedRoles[sistemaSeleccionado] = [];
      } else {
        this.selectedRoles[sistemaSeleccionado] = this.perfiles.map(perfil => perfil.perCodigo);
      }
    },

    
  },
  computed: {
    isIndeterminate() {
      return this.selectAllChecked.length > 0 && this.selectAllChecked.length < this.opcionesPaisComercioCadena.length;
    },
    selectAllChecked: {
      get() {
        return (
          this.selectedOptions.length === this.opcionesPaisComercioCadena.length
        );
      },
      set(value) {
        this.selectedOptions = value
          ? this.opcionesPaisComercioCadena.map(opcion => opcion.sistemaCod)
          : [];
      },
    },
    
    
  },
  mounted() {
    //this.cargarPaisComercio();
    this.cargarPrimerPanel();
    }
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

  .checkbox-container {
    max-height: 300px; /* ajusta la altura máxima según tus necesidades */
    overflow-y: auto;
  }
</style>
