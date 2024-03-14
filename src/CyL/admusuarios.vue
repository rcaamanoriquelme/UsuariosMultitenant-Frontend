<template>
  <div>
    <!-- Agrega el botón para agregar usuario -->
    <router-link to="/CyL/admusuariossave">
      <v-btn color="primary" class="mb-2">Agregar Usuario</v-btn>
    </router-link>
    <v-data-table
      :headers="headers"
      :items="usuarios"
      :items-per-page="10"
      class="elevation-1"
    >
      <!-- Personaliza las columnas y el contenido según tus necesidades -->
      <!-- Dentro de la sección de la plantilla -->
      <!-- Dentro de la sección de la plantilla -->
      <template v-slot:item.actions="props">
        <td>
          <v-btn class="status-chip" @click="openEditModal(props.item.usuLogin)" color="success" dark>Editar</v-btn>
          <v-btn class="status-chip" @click="confirmarEliminarUsuario(props.item)" :color="props.item.usuEliminado === '0' ? 'red' : 'green'" dark>
            {{ props.item.usuEliminado === '0' ? 'Desactivar' : 'Activar' }}
          </v-btn>

        </td>
      </template>
    </v-data-table>
    <!-- Modal de Edición -->
    <v-dialog v-model="dialog" max-width="1200">
      <template v-slot:activator="{ on }">
        <!-- Eliminado el botón y activador, ya que ahora se maneja con el router-link -->
      </template>

      <v-card>
        <v-card-title>
          <span class="headline">Editar Usuario</span>
        </v-card-title>

        <!-- Contenido del formulario de edición -->
        <v-card-text>
          <v-alert v-if="mostrarAlerta" type="error" outlined>
            {{ alertaMensaje }}
          </v-alert>
          <v-form @submit.prevent="updateUsuario">
            <!-- Aquí coloca los campos que deseas editar -->
            <!-- Ejemplo: -->
            <v-row>
        <v-col cols="12" md="6">
          <v-text-field v-model="editedUsuario.usuLogin" label="Usuario" required></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field v-model="editedUsuario.usuPassword" label="Contraseña" type="password" required></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field v-model="editedUsuario.usuPasswdRepeat" label="Repetir Contraseña" type="password" required></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field v-model="editedUsuario.usuNombre" label="Nombre" required></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field v-model="editedUsuario.usuApellido" label="Apellido" required></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field v-model="editedUsuario.usuMail" label="Correo Electrónico" required></v-text-field>
        </v-col>    
        <v-col cols="12" md="6">
          <v-text-field v-model="editedUsuario.usuRut" label="RUT" required></v-text-field>
        </v-col>   
        <v-col cols="6" md="6">
          <v-checkbox v-model="editedUsuario.activo" label="Activo" value="1"></v-checkbox>
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
                v-for="(opcion, index) in opcionesPaisComercioCadena"
                :key="index"
                :value="opcion.sistemaCod"
                :label="opcion.sistemaCyl"
                v-model="selectedOptions"
                @change="handleComercioChange(opcion.sistemaCod)"
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
                      @change="handleCheckboxChange(opcion.sistemaCod, sistemaSeleccionado)"
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
                    @change="handleCheckboxRolesChange(perfil.perCodigo, sistemaSeleccionado)"
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
            <!-- Agrega más campos según las propiedades de usuario -->

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
          ¿Estás seguro de que quieres eliminar este usuario?
        </v-card-text>
        <v-card-actions>
          <v-btn @click="confirmDialog = false" color="blue darken-1" text>
            Cancelar
          </v-btn>
          <v-btn @click="eliminarUsuario" color="red darken-1" text>
            Confirmar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { getUsuarios, getUsuario, getUsuarioCYR, getUsuarioIFC, deleteUsuario, getPComercio, getCYL, getCYR, getIFC, getPerfiles, getMonitorWeb } from "@/services/admusuarios.js";
import { updateUsuario } from "@/services/admusuarios.js";

export default {
  data() {
    return {
      usuarios: [],
      headers: [
        { text: "Usuario", value: "usuLogin" },
        { text: "Nombre", value: "usuNombre" },
        { text: "Apellido", value: "usuApellido" },
        { text: "Correo Electrónico", value: "usuMail" },
        { text: "", value: "actions", sortable: false },
        // Agrega más headers según las propiedades de tus usuarios
      ],
      dialog: false,
      primeraSeleccion: {
        cyl: false, // Inicializa como un array vacío
        ifc: false,
        cyr: false,
        mow: false,
      }, 
      deseleccionadas: [],
      editedUsuario: {
        usuLogin: "",
        usuLoginMod: "",
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
        sistemaInfoUpp: [],
        sistemaInfoDel: []
      },
      perfiles: [],
      selectedCadenaLocal: {
        cyl: [], // Inicializa como un array vacío
        ifc: [],
        cyr: [],
        mow: [],
      },
      deselectedCadenaLocal: {
        cyl: [], // Inicializa como un array vacío
        ifc: [],
        cyr: [],
        mow: [],
      },
      selectedCadenaLocal2: {
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
      selectedRoles: {
        cyl: [],
        ifc: [],
        cyr: [],
        mow: [],
      },
      deselectedRoles: {
        cyl: [],
        ifc: [],
        cyr: [],
        mow: [],
      },
      alertaMensaje: "",
      confirmDialog: false,
      usuarioAEliminar: null,
      selectedOptions: [], // Cambia aquí
      sistemaSeleccionado: "",
      opcionesPaisComercioCadena: [],
      sistemaOpcionesSeleccionadas: {},
      mostrarAlerta: false,
      tituloSistemaCombinacion: "",
      opcionesCadenaLocal: [],
    };
  },
  mounted() {
    this.fetchUsuarios();
  },
  methods: {
    async fetchUsuarios() {
      try {
        // Llama a la función getUsuarios desde admusuarios.js
        console.log(localStorage.user);
        const allUsuarios = await getUsuarios();
        //this.usuarios = await getUsuarios();
        this.usuarios = allUsuarios.filter(usuario => usuario.usuEliminado === '0');
      } catch (error) {
        console.error('Error fetching usuarios:', error);
        // Puedes manejar el error según tus necesidades (mostrar un mensaje de error, etc.)
      }
    },
    formatDate(dateString) {
      // Formatea la fecha ISO 8601 a 'DD/MM/YYYY'
      const date = new Date(dateString);
      const formattedDate = date.toLocaleDateString("es-CL", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });

      return formattedDate;
    },
    async cargarPrimerPanel(llavePCC) {
      this.opcionesPaisComercioCadena = await getPComercio();
      
      // Filtra las opciones que coinciden con llavePCC
      const opcionesSeleccionadas = this.opcionesPaisComercioCadena.filter(opcion => opcion.sistemaCod === llavePCC);

      // Mapea las opciones seleccionadas a los valores del sistemaCod
      this.selectedOptions = opcionesSeleccionadas.map(opcion => opcion.sistemaCod);

      console.log("selectedOptions: ", this.selectedOptions);
      localStorage.setItem('selectedPaisComercio', JSON.stringify(this.selectedOptions))
    },
    async cargarPaisComercio() {
      try {
        const paCodigos = [];
        const coCodigos = [];
        const sistemaSel = this.sistemaSeleccionado;
        this.selectedOptions.forEach((opcion) => {
          const [pais, comercio] = opcion.split(',');
          paCodigos.push(parseInt(pais));
          coCodigos.push(parseInt(comercio));
        });
        if (sistemaSel === "cyl") {
          this.opcionesCadenaLocal = await getCYL(paCodigos, coCodigos);
          this.getUsuarioCYL = await getUsuario(this.editedUsuario.usuLogin);
          const tiendasCYL = this.getUsuarioCYL.cadenas;
          this.tituloSistemaCombinacion = "Pais + Comercio + Cadena";
          
          //this.selectedCadenaLocal[sistemaSel] = [];
          if (this.primeraSeleccion[sistemaSel]==false) {
            for (const tienda of tiendasCYL) {
              const tiendaSplit = tienda.split(",");
              const tiendaSplitStr = tiendaSplit[2]+","+tiendaSplit[0]+","+tiendaSplit[1];
              //console.log(tiendaSplitStr);
              console.log(tiendaSplitStr);
              
              this.selectedCadenaLocal[sistemaSel].push(tiendaSplitStr);
              this.selectedCadenaLocal2[sistemaSel].push(tiendaSplitStr);
              //localStorage.setItem(`selectedCadenaLocal${sistemaSel}`, JSON.stringify(this.selectedCadenaLocal[sistemaSel]));
              

            }
            console.log("está en false");
          }else{
            console.log("está en true");
            localStorage.setItem(`selectedCadenaLocal2${sistemaSel}`, JSON.stringify(this.selectedCadenaLocal[sistemaSel]));
            const selCadLoc2 = JSON.parse(localStorage.getItem(`selectedCadenaLocal2${sistemaSel}`));
            console.log("Seleccionados: ",selCadLoc2);
            this.selectedCadenaLocal[sistemaSel] = selCadLoc2;
            console.log("Seleccionados 2: ",selCadLoc2);
            
          }
          console.log("Primera selección antes: ", this.primeraSeleccion[sistemaSel]);
          this.primeraSeleccion[sistemaSel] = true;
          console.log("Primera selección después: ", this.primeraSeleccion[sistemaSel]);
          //this.selectedOptionsMemory["cyl"] = this.selectedCadenaLocal["cyl"];
        } else if (sistemaSel === "ifc") {
          this.opcionesCadenaLocal = await getIFC(paCodigos, coCodigos);
          this.getUsuarioIFC = await getUsuarioIFC(this.editedUsuario.usuLogin);
          console.log("getUsuarioIFC: ",this.getUsuarioIFC);
          const tiendasIFC = this.getUsuarioIFC.locales;
          this.tituloSistemaCombinacion = "Pais + Comercio + Cadena";
          //this.selectedCadenaLocal[sistemaSel] = [];
          if (this.primeraSeleccion[sistemaSel]==false) {
          for (const tienda of tiendasIFC) {
            // const tiendaSplit = tienda.split(",");
            // const tiendaSplitStr = tiendaSplit[2]+","+tiendaSplit[1]+","+tiendaSplit[0];
            // //console.log(tiendaSplitStr);
            // console.log("IFC: ",tiendaSplitStr);
            
            // this.selectedCadenaLocal[sistemaSel].push(tiendaSplitStr);
            const tiendaSplit = tienda.split(",");
            const tiendaArroba = tienda.split("@");
            //const localesStr = tiendaSplit[2].split("@")[1];
            //const locales = localesStr.split(","); // Separa los diferentes locales
            console.log("tiendaArroba: ",tiendaArroba);
            const matrizTienda = tiendaArroba[1].split(",");
            console.log(matrizTienda);
            let nuevoValor; // Se define fuera del forEach para ser accesible en cada iteración

            matrizTienda.forEach(local => {
              nuevoValor = `${local},${tiendaSplit[0]},${tiendaSplit[1]}`;
              console.log("nuevoValor: ",nuevoValor);
              this.selectedCadenaLocal[sistemaSel].push(nuevoValor);
            });
            //localStorage.setItem(`selectedCadenaLocal${sistemaSel}`, JSON.stringify(this.selectedCadenaLocal[sistemaSel]));
          //this.selectedOptionsMemory["ifc"] = this.selectedCadenaLocal["ifc"];
          }
        }else{
            console.log("está en true");
            localStorage.setItem(`selectedCadenaLocal2${sistemaSel}`, JSON.stringify(this.selectedCadenaLocal[sistemaSel]));
            const selCadLoc2 = JSON.parse(localStorage.getItem(`selectedCadenaLocal2${sistemaSel}`));
            console.log("Seleccionados: ",selCadLoc2);
            this.selectedCadenaLocal[sistemaSel] = selCadLoc2;
            console.log("Seleccionados 2: ",selCadLoc2);
            
          }
          this.primeraSeleccion[sistemaSel] = true;
        } else if (sistemaSel === "cyr") {
          this.opcionesCadenaLocal = await getCYR(paCodigos, coCodigos);
          this.getUsuarioCYR = await getUsuarioCYR(this.editedUsuario.usuLogin);
          const tiendasCYR = this.getUsuarioCYR.locales;
          this.tituloSistemaCombinacion = "Pais + Comercio + Local";

          // Limpia el array antes de asignar los nuevos valores
          //this.selectedCadenaLocal[sistemaSel] = [];
          // this.$on('checkbox-change', () => {
          //   this.primeraSeleccion[sistemaSel] = false; // Setea como false al cambiar checkboxes
          // }); 
          if (this.primeraSeleccion[sistemaSel]==false) {
          for (const tienda of tiendasCYR) {
            const tiendaSplit = tienda.split(",");
            const tiendaArroba = tienda.split("@");
            //const localesStr = tiendaSplit[2].split("@")[1];
            //const locales = localesStr.split(","); // Separa los diferentes locales
            console.log("tiendaArroba: ",tiendaArroba);
            const matrizTienda = tiendaArroba[1].split(",");
            console.log(matrizTienda);
            let nuevoValor; // Se define fuera del forEach para ser accesible en cada iteración

            matrizTienda.forEach(local => {
              nuevoValor = `${local},${tiendaSplit[0]},${tiendaSplit[1]}`;
              console.log("nuevoValor: ",nuevoValor);
              this.selectedCadenaLocal[sistemaSel].push(nuevoValor);
            });

            // localStorage.setItem(
            //   `selectedCadenaLocal${sistemaSel}`,
            //   JSON.stringify(this.selectedCadenaLocal[sistemaSel])
            // );
          }  }else{
            console.log("está en true");
            localStorage.setItem(`selectedCadenaLocal2${sistemaSel}`, JSON.stringify(this.selectedCadenaLocal[sistemaSel]));
            const selCadLoc2 = JSON.parse(localStorage.getItem(`selectedCadenaLocal2${sistemaSel}`));
            console.log("Seleccionados: ",selCadLoc2);
            this.selectedCadenaLocal[sistemaSel] = selCadLoc2;
            console.log("Seleccionados 2: ",selCadLoc2);
            
          }
          this.primeraSeleccion[sistemaSel] = true;    
      }  
        else if (sistemaSel === "mow") {
          this.opcionesCadenaLocal = await getMonitorWeb(paCodigos, coCodigos);
          this.tituloSistemaCombinacion = "Pais + Comercio + Local";
          //this.selectedOptionsMemory["monitor_web"] = this.selectedCadenaLocal["monitor_web"];
        }  else {
          this.tituloSistemaCombinacion = "Seleccione sistema...";
        }

        await this.cargarPerfiles();
        
        //localStorage.setItem('perfiles', JSON.stringify(this.perfiles));
        
      } catch (error) {
        console.error("Error al cargar opciones de País Comercio y Cadena Local:", error);
      }
    },
    handleComercioChange(opcionSeleccionada) {
      const index = this.deseleccionadas.indexOf(opcionSeleccionada);

      if (index === -1) {
        // Si no está en el array deseleccionadas, agrégalo
        this.deseleccionadas.push(opcionSeleccionada);
      } else {
        // Si ya está en el array deseleccionadas, quítalo
        this.deseleccionadas.splice(index, 1);
      }

      // Puedes hacer aquí cualquier otra acción que necesites con las opciones deseleccionadas
      console.log('Opciones deseleccionadas:', this.deseleccionadas);
    },
    async cargarPerfiles() {
      try {
        if (this.sistemaSeleccionado) {
          let rolesUsuario = [];

          if (this.sistemaSeleccionado === "cyl") {
            this.getUsuarioCYL = await getUsuario(this.editedUsuario.usuLogin);
            rolesUsuario = this.getUsuarioCYL.roles;
            localStorage.setItem(`selectedRoles${this.sistemaSeleccionado}`, JSON.stringify(rolesUsuario));
          } else if (this.sistemaSeleccionado === "cyr") {
            this.getUsuarioCYR = await getUsuarioCYR(this.editedUsuario.usuLogin);
            rolesUsuario = this.getUsuarioCYR.roles;
            localStorage.setItem(`selectedRoles${this.sistemaSeleccionado}`, JSON.stringify(rolesUsuario));
          } else if (this.sistemaSeleccionado === "ifc") {
            this.getUsuarioIFC = await getUsuarioIFC(this.editedUsuario.usuLogin);
            rolesUsuario = this.getUsuarioIFC.roles;
            localStorage.setItem(`selectedRoles${this.sistemaSeleccionado}`, JSON.stringify(rolesUsuario));
          }

          this.perfiles = await getPerfiles(this.sistemaSeleccionado);
          console.log("Perfiles: ", this.perfiles);

          // Filtra solo los roles válidos para el sistema actual
          const rolesFiltrados = rolesUsuario.filter(role => this.perfiles.some(perfil => perfil.perCodigo === role));

          // Asigna los roles filtrados al array
          this.selectedRoles[this.sistemaSeleccionado] = rolesFiltrados;

          // Guarda los perfiles en localStorage
          localStorage.setItem('perfiles', JSON.stringify(this.perfiles));

          // Guarda los roles seleccionados en localStorage
          localStorage.setItem('selectedRoles', JSON.stringify(this.selectedRoles[this.sistemaSeleccionado]));
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
    async openEditModal(userId) {
      try {
        // Llama a la función getUsuario desde admusuarios.js para obtener los detalles del usuario
        this.mostrarAlerta = false;
        this.editedUsuario = await getUsuario(userId);
        this.editedUsuario.usuPassword = "";
        const comercioObj = this.editedUsuario.comercio[0].split(",");
        const llavePCC = comercioObj[1]+","+comercioObj[0];
        console.log("llavePCC: ",llavePCC);
        
        this.cargarPrimerPanel(llavePCC);
        this.dialog = true;
      } catch (error) {
        console.error('Error fetching usuario details:', error);
        // Puedes manejar el error según tus necesidades (mostrar un mensaje de error, etc.)
      }
    },
    handleCheckboxRolesChange(value, sistemaSel) {
      const selectedOptions = this.selectedRoles[sistemaSel];

      // Si el checkbox se deselecciona, filtra el valor deseleccionado
      if (!selectedOptions.includes(value)) {
        // Guarda el valor deseleccionado en un array separado
        const deselectedOptions = this.deselectedRoles[sistemaSel] || [];
        deselectedOptions.push(value);
        this.deselectedRoles[sistemaSel] = deselectedOptions;
      }

      // Guarda todos los valores seleccionados y deseleccionados en el localStorage
      localStorage.setItem(`selectedRoles${sistemaSel}`, JSON.stringify(selectedOptions));
      localStorage.setItem(`deselectedRoles${sistemaSel}`, JSON.stringify(this.deselectedRoles[sistemaSel]));
      console.log(`deselectedRoles${sistemaSel}: `, JSON.parse(localStorage.getItem(`deselectedRoles${sistemaSel}`)));
    },

    handleCheckboxChange(value, sistemaSel) {
      const selectedOptions = this.selectedCadenaLocal[sistemaSel];

      // Si el checkbox se deselecciona, filtra el valor deseleccionado
      if (!selectedOptions.includes(value)) {
        // Guarda el valor deseleccionado en un array separado
        const deselectedOptions = this.deselectedCadenaLocal[sistemaSel] || [];
        deselectedOptions.push(value);
        this.deselectedCadenaLocal[sistemaSel] = deselectedOptions;
      }

      // Guarda todos los valores seleccionados y deseleccionados en el localStorage
      localStorage.setItem(`selectedCadenaLocal${sistemaSel}`, JSON.stringify(selectedOptions));
      localStorage.setItem(`deselectedCadenaLocal${sistemaSel}`, JSON.stringify(this.deselectedCadenaLocal[sistemaSel]));
      console.log(`deselectedCadenaLocal${sistemaSel}: `, JSON.parse(localStorage.getItem(`deselectedCadenaLocal${sistemaSel}`)));
    },
    closeEditModal() {
      // Lógica para cerrar el modal
      this.sistemaSeleccionado = "";
      this.opcionesCadenaLocal = [];
      this.tituloSistemaCombinacion = "";
      this.perfiles = [];
      this.primeraSeleccion["cyl"] = false;
      this.primeraSeleccion["cyr"] = false;
      this.primeraSeleccion["ifc"] = false;
      this.primeraSeleccion["mow"] = false;
      this.selectedCadenaLocal["cyl"] = [];
      this.selectedCadenaLocal["cyr"] = [];
      this.selectedCadenaLocal["ifc"] = [];
      this.selectedCadenaLocal["mow"] = [];
      this.dialog = false;
    },
    async updateUsuario() {
      if (!this.validarCampos()) {
        return;
      }

      try {
        // Inicializa la propiedad sistemaInfo
        this.editedUsuario.sistemaInfo = [];
        
        //Agrupa las opciones seleccionadas por sistema
        console.log(this.selectedRoles);
        const sistemasSeleccionados = this.sistemas.map(opcion => {
          const sistemaSel = opcion.value;
        const localesStorage = this.deselectedCadenaLocal[sistemaSel];
        console.log("localesStorage deselectedCadenaLocal: ",localesStorage);
        const localesArray = localesStorage ? localesStorage.join('@') : "";
        const rolesStorage = this.deselectedRoles[sistemaSel];
        const rolesArray = rolesStorage ? rolesStorage.join('@') : "";
          if (!rolesArray || !localesArray) { 
              return null; // Excluye la entrada
          }

          return { 
              sistema: opcion.value,
              roles: this.selectedRoles[opcion.value].map(rol => `${rol.toUpperCase()}`).join(','),
              locales: opcion.value === 'cyl' || opcion.value === 'ifc' ? '' :  this.selectedCadenaLocal[opcion.value]
                  .filter(local => local.sistemaCod === opcion.sistemaCod)
                  .map(local => local)
                  .join('@'),
              cadenas: opcion.value === 'cyr' || opcion.value === 'mow' ? '' : this.selectedCadenaLocal[opcion.value]
                  .filter(local => local.sistemaCod === opcion.sistemaCod)
                  .map(local => local)
                  .join('@'),
          };
      }).filter(sistema => sistema !== null);


        const sistemasSeleccionadosDel = this.sistemas.map(opcion => {
        const sistemaSel = opcion.value;
        const localesStorage = this.deselectedCadenaLocal[sistemaSel];
        console.log("localesStorage deselectedCadenaLocal: ",localesStorage);
        const localesArray = localesStorage ? localesStorage.join('@') : "";
        const rolesStorage = this.deselectedRoles[sistemaSel];
        const rolesArray = rolesStorage ? rolesStorage.join('@') : "";
        console.log(localesArray);

        // Solo incluir el sistema si no es "mow" o alguno de los campos (roles, cadenas o locales) no están vacíos.
        if (rolesArray || localesArray) { 
          return {
            sistema: sistemaSel,
            roles: rolesArray,
            locales: sistemaSel === 'cyl' || sistemaSel === 'ifc' ? '' : localesArray,
            cadenas: sistemaSel === 'cyr' || sistemaSel === 'mow' ? '' : localesArray
          };
        } else {
          return null;  // Retornamos null para excluir el elemento 
        }

        })
        .filter(sistema => sistema !== null);

      

        // Convierte el array y asigna a sistemaInfo
        this.editedUsuario.sistemaInfoUpp = sistemasSeleccionados;
        delete this.editedUsuario.cadenas;
        delete this.editedUsuario.comercio;
        delete this.editedUsuario.locales;
        delete this.editedUsuario.menu;
        delete this.editedUsuario.pais;
        delete this.editedUsuario.permisos;
        delete this.editedUsuario.roles;
        delete this.editedUsuario.usuEliminado;
        delete this.editedUsuario.sistemaInfo;
        delete this.editedUsuario.usuPasswdRepeat;
        this.editedUsuario.sistemaInfoDel = sistemasSeleccionadosDel;
       // console.log("Datos Usuario: ", localStorage.getItem('user'));
        const storedUser = localStorage.getItem('user');
        const usuLogMod = JSON.parse(storedUser).usuario.usuLogin;
        this.editedUsuario.usuLoginMod = usuLogMod;
        this.editedUsuario.paisComercio = this.deseleccionadas && Object.keys(this.deseleccionadas).length > 0
        ?  this.selectedOptions
              .map(local => local)
              .join('@')
              : "";

        this.editedUsuario.paisComercioEliminar = this.deseleccionadas && Object.keys(this.deseleccionadas).length > 0
        ? JSON.parse(localStorage.getItem('selectedPaisComercio')).join('@')
        : "";
        this.editedUsuario.activo = this.editedUsuario.activo ? "1" : "0";
        // Llama a la función para guardar el usuario
        console.log("Pais Comercio: ", this.editedUsuario.paisComercio);
        await updateUsuario(this.editedUsuario);
        this.closeEditModal();
        this.fetchUsuarios();
        //this.$router.push('/CyL/admusuarios');
      } catch (error) {
        console.error("Error al guardar el usuario:", error);
      }
    },
    confirmarEliminarUsuario(usuario) {
      this.usuarioAEliminar = usuario;
      this.confirmDialog = true;
    },
    async eliminarUsuario() {
      try {
        if (this.usuarioAEliminar) {
          await deleteUsuario(this.usuarioAEliminar.usuLogin);
          
          this.fetchUsuarios();
          this.confirmDialog = false;
        }
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
        // Puedes manejar el error según tus necesidades (mostrar un mensaje de error, etc.)
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
    validarCampos() {
      const camposFaltantes = [];

      console.log("usuario:", this.editedUsuario);

      if (!this.editedUsuario.usuLogin || this.editedUsuario.usuLogin.length > 8) {
        camposFaltantes.push("Usuario debe tener menos de 8 caracteres");
      }
      if (!this.editedUsuario.usuNombre) {
        camposFaltantes.push("Nombre");
      }
      if (!this.editedUsuario.usuApellido) {
        camposFaltantes.push("Apellido");
      }
      if (!this.editedUsuario.usuMail || !this.validarEmail(this.editedUsuario.usuMail)) {
        camposFaltantes.push("Correo Electrónico");
      }
      if (!this.editedUsuario.usuRut || !this.validarRut(this.editedUsuario.usuRut)) {
        camposFaltantes.push("RUT");
      }
      if (!this.sistemaSeleccionado) {
        camposFaltantes.push("Sistema");
      }
      if (this.editedUsuario.length === 0) {
        camposFaltantes.push("País + Comercio");
      }
      if (this.editedUsuario.length === 0) {
        camposFaltantes.push("País + Comercio + Cadena");
      }
      if (this.editedUsuario.length === 0) {
        camposFaltantes.push("Roles");
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

.status-chip {
  margin-left: 10px; /* Ajusta el valor del margen según tus necesidades */
}
</style>
