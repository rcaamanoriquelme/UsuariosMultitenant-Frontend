<template>
  <div>
    <vue-element-loading :active="loader" spinner="bar-fade-scale" color="var(--primary)" />

    <v-expansion-panels class="pb-3">
      <v-expansion-panel>
        <v-expansion-panel-header>
          <i class="pe-7s-edit"></i> Filtros
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-container fluid>
            <v-row>
              <v-col cols="12" sm="3">
                <div class="mb-2"><strong>Estado</strong></div>
                <v-select
                  v-model="estado"
                  :items="['Todos', 'Cuadrados', 'Descuadrados', 'Pendientes', 'Local No Configurado']"
                  label="Estado"
                ></v-select>
              </v-col>
              <v-col cols="12" sm="2">
                <div class="mb-2"><strong>%Comisión</strong></div>
                <v-radio-group v-model="comision">
                  <v-radio label="Sí" value="S" color="green"></v-radio>
                  <v-radio label="No" value="N" color="red"></v-radio>
                </v-radio-group>
              </v-col>
              <v-col cols="12" sm="2">
                <div class="mb-2"><strong>SAP</strong></div>
                <v-radio-group v-model="sap">
                  <v-radio label="Sí" value="S" color="green"></v-radio>
                  <v-radio label="No" value="N" color="red"></v-radio>
                </v-radio-group>
              </v-col>
              <v-col cols="12" sm="2">
                <div class="mb-2"><strong>TAR</strong></div>
                <v-radio-group v-model="mp">
                  <v-radio label="Sí" value="S" color="green"></v-radio>
                  <v-radio label="No" value="N" color="red"></v-radio>
                </v-radio-group>
              </v-col>
              <v-col cols="12" sm="2">
                <div class="mb-2"><strong>REC</strong></div>
                <v-radio-group v-model="rec">
                  <v-radio label="Sí" value="S" color="green"></v-radio>
                  <v-radio label="No" value="N" color="red"></v-radio>
                </v-radio-group>
              </v-col>
            </v-row>
          </v-container>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>

    <v-col cols="12" sm="4" class="d-flex justify-center align-items-center">
      <!-- Botón de Búsqueda -->
      <b-button class="custom-btn" variant="primary" @click="getData">
        <i class="pe-7s-search btn-icon-wrapper"></i> Buscar
      </b-button>

      <!-- Botón de Descarga de Excel -->
      <b-button class="custom-btn white-text-icon" variant="success" @click="downloadExcel">
          Exportar
      </b-button>

      <!-- Botón para Limpiar Campos -->
      <b-button class="custom-btn white-text-icon" variant="warning" @click="limpiar">
        <i class="pe-7s-refresh-2 btn-icon-wrapper"></i> Limpiar
      </b-button>

      <!-- Botón para Volver -->
      <b-button class="custom-btn" color="warning" @click="volver">
        <i class="pe-7s-back btn-icon-wrapper"></i> Volver
      </b-button>
    </v-col>
    

    <v-row>
      <v-col cols="12">
        <v-data-table
          :headers="tableHeaders"
          :items="filteredItems"
          :loading="loader"
          loading-text="Cargando datos..."
          class="elevation-1"
        >
        <template v-slot:item="{ item }">
          <tr>
            <td>{{ item.fechaContable }}</td>
            <td>{{ item.cadena }}</td>
            <td>{{ item.local }}</td>
            <td>{{ item.descripcion }}</td>
            <td :class="{ 'descuadre': item.cmp_monto !== item.cyl_monto }">{{ item.cmp_monto }}</td>
            <td :class="{ 'descuadre': item.cmp_cantidad !== item.cyl_cantidad}">{{ item.cmp_cantidad }}</td>
            <td :class="{ 'descuadre': item.cyl_monto !== item.cmp_monto }">{{ item.cyl_monto }}</td>
            <td :class="{ 'descuadre': item.cyl_cantidad !== item.cmp_cantidad }">{{ item.cyl_cantidad }}</td>
            <td>{{ item.trxPorcentaje }}</td>
            <td>{{ item.porcentajeComision }}</td>
            <td>{{ item.sap }}</td>
            <td>{{ item.tar }}</td>
            <td>{{ item.rec }}</td>
            <td>{{ item.localConfigurado }}</td>
          </tr>
        </template>
        </v-data-table>
      </v-col>
    </v-row>
  </div>
</template>
  
  
  <script>
  import config from '../../config.js';
  import { saveAs } from 'file-saver';
  import * as XLSX from 'xlsx';
  import toastr from 'toastr';
  import 'toastr/build/toastr.min.css';
 
  const VUE_APP_BASE_API_URL_HOME = config.VUE_APP_BASE_API_URL_HOME;

  toastr.options = {
    closeButton: true,
    debug: false,
    newestOnTop: true,
    progressBar: true,
    positionClass: 'toast-top-right',
    preventDuplicates: false,
    onclick: null,
    showDuration: '300',
    hideDuration: '1000',
    timeOut: '5000',
    extendedTimeOut: '1000',
    showEasing: 'swing',
    hideEasing: 'linear',
    showMethod: 'fadeIn',
    hideMethod: 'fadeOut',
  };
  
  export default {
    data() {
      return {
        loader: false,
        fecha: this.$route.params.fecha,
        idCadena: this.$route.params.idCadena,
        comision: 'S',
        sap: 'S',
        mp: 'S',
        rec: 'S',
        estado: 'Todos',
        items: [],
        tableHeaders: [
          { text: 'Fecha Contable', value: 'fechaContable' },
          { text: 'Cadena', value: 'cadena' },
          { text: 'Local', value: 'local' },
          { text: 'Descripción', value: 'descripcion' },
          { text: 'Tesorería', value: 'cmp_monto' },
          { text: 'Tesorería Qty', value: 'cmp_cantidad' },
          { text: 'CyL', value: 'cyl_monto' },
          { text: 'CyL Qty', value: 'cyl_cantidad' },
          { text: 'Trx%', value: 'trxPorcentaje' },
          { text: '%Comisión', value: 'porcentajeComision' },
          { text: 'Sap', value: 'sap' },
          { text: 'Tar', value: 'tar' },
          { text: 'Rec', value: 'rec' },
          { text: 'Local Configurado', value: 'localConfigurado' },
        ],
      };
    },
    computed : {

        filteredItems() {
            return this.items.filter(item => {
                switch (this.estado) {
                case 'Cuadrados':
                    return item.cmp_monto === item.cyl_monto && item.cmp_cantidad === item.cyl_cantidad;
                case 'Descuadrados':
                    return item.cmp_monto !== item.cyl_monto || item.cmp_cantidad !== item.cyl_cantidad;
                case 'Pendientes':
                    return 0 == item.cyl_cantidad
                case 'Local No Configurado':
                    return item.localConfigurado === 'N';
                default:
                    return true;
                }
            });
        },
    },

    methods: {
      async getDataInicial() {
        this.loader = true;
        
        console.log(`${VUE_APP_BASE_API_URL_HOME}/detalle`)
        try {
          const response = await fetch(`${VUE_APP_BASE_API_URL_HOME}/detalle`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              fechaInicio: this.fecha.split('T')[0],
              idCadena: this.idCadena !== null ? this.idCadena : -1,
  
            })
          });
          
          const result = await response.json();
          
          if (result && Array.isArray(result)) {
                this.items = result.map(item => {
                    let fecha = new Date(item.fecha_cont);
                    let formattedDate = ("0" + fecha.getDate()).slice(-2) + "/" + ("0" + (fecha.getMonth() + 1)).slice(-2) + "/" + fecha.getFullYear();
                     
                        return {
                            fechaContable: formattedDate,
                            cadena: item.cad_nombre,
                            local: item.cmp_loc_numero,
                            descripcion: item.loc_nombre,
                            cmp_monto: item.cmp_monto,
                            cmp_cantidad: item.cmp_cantidad,
                            cyl_monto: item.cyl_monto,
                            cyl_cantidad: item.cyl_cantidad,
                            trxPorcentaje: Math.round((item.cyl_cantidad / item.cmp_cantidad) * 100), 
                            porcentajeComision: item.cal_comision === 'S' ? 'Sí' : 'No',
                            sap: item.enviado_a_sap === 'S' ? 'Sí' : 'No',
                            tar: item.enviados_mp === 'S' ? 'Sí' : 'No',
                            rec: item.enviados_rec === 'S' ? 'Sí' : 'No',
                            localConfigurado: item.local_envia === 'S' ? 'Sí' : 'No',
                        };
            });

            console.log(this.items);
        }
        else {
            console.error("No se pudo obtener los datos.");
            this.items = [];
          }
        } catch (error) {
          console.error(error);
        } finally {
          this.loader = false;
        }
      },

      async getData() {
        this.loader = true;
        
        console.log(`${VUE_APP_BASE_API_URL_HOME}/detalle`)
        try {
          const response = await fetch(`${VUE_APP_BASE_API_URL_HOME}/detalle`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              fechaInicio: this.fecha.split('T')[0],
              idCadena: this.idCadena !== null ? this.idCadena : -1,
              comision: this.comision,
              sap: this.sap,
              mp: this.mp,
              rec: this.rec,
  
            })
          });
          
          const result = await response.json();
          
          if (result && Array.isArray(result)) {
                this.items = result.map(item => {
                    let fecha = new Date(item.fecha_cont);
                    let formattedDate = ("0" + fecha.getDate()).slice(-2) + "/" + ("0" + (fecha.getMonth() + 1)).slice(-2) + "/" + fecha.getFullYear();

                        return {
                            fechaContable: formattedDate,
                            cadena: item.cad_nombre,
                            local: item.cmp_loc_numero,
                            descripcion: item.loc_nombre,
                            cmp_monto: item.cmp_monto,
                            cmp_cantidad: item.cmp_cantidad,
                            cyl_monto: item.cyl_monto,
                            cyl_cantidad: item.cyl_cantidad,
                            trxPorcentaje: Math.round((item.cyl_cantidad / item.cmp_cantidad) * 100), 
                            porcentajeComision: item.cal_comision === 'S' ? 'Sí' : 'No',
                            sap: item.enviado_a_sap === 'S' ? 'Sí' : 'No',
                            tar: item.enviados_mp === 'S' ? 'Sí' : 'No',
                            rec: item.enviados_rec === 'S' ? 'Sí' : 'No',
                            localConfigurado: item.local_envia === 'S' ? 'Sí' : 'No',
                        };
            });
        }
        else {
            console.error("No se pudo obtener los datos.");
            this.items = [];
          }
        } catch (error) {
          console.error(error);
        } finally {
          this.loader = false;
        }
      },

      limpiar() {
        this.comision = 'S';
        this.sap = 'S';
        this.mp = 'S';
        this.rec = 'S';
        this.estado = 'Todos';
        this.items = [];
      },    
      volver() {
        this.$router.push({ name: 'Home' });
      },
      downloadExcel() {

        if (this.filteredItems.length === 0) {
            toastr.warning('No hay registros para exportar');
            return;
        }
        const newFilteredItems = this.filteredItems.map(item => ({
          'Fecha Contable': item.fechaContable,
          'Cadena': item.cadena,
          'Local': item.local,
          'Descripción': item.descripcion,
          'Tesorería': item.cmp_monto,
          'Tesorería Qty': item.cmp_cantidad,
          'CyL': item.cyl_monto,
          'CyL Qty': item.cyl_cantidad,
          'Trx %': item.trxPorcentaje,
          '% Comisión': item.porcentajeComision,
          'Sap': item.sap,
          'Tar': item.tar,
          'Rec': item.rec,
          'Local Configurado': item.localConfigurado,
        }));

        const ws = XLSX.utils.json_to_sheet(newFilteredItems);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Resumen");
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
        saveAs(data, 'Resumen.xlsx');
      },
    },
      mounted() {
        this.getDataInicial();
      }
  };
  </script>
  
  <style scoped>
  .custom-btn {
    width: 150px;
    height: 40px; 
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 10px;
  }

  .white-text-icon {
    color: white; 
  }

  .descuadre {
    color: red;
  }
  </style>
