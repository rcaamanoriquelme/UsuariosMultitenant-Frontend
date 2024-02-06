<template>
  <div>
    <vue-element-loading :active="loader" spinner="bar-fade-scale" color="var(--primary)" />

    <v-data-table 
      v-model="selected"
      :headers="tableHeaders"
      :items="desserts"
      :loading="loadTable"
      loading-text="Cargando Transacciones..."
      :search="search"
      sort-by="detalleemisortransacciones.idemisor"
      item-key="detalleemisortransacciones.idemisor"
      :items-per-page="10"
      class="elevation-1"
      :footer-props="{
        'items-per-page-text':'Registros por página',
        'pageText': '{0}-{1} de {2}'
      }"
    >
    <template v-slot:item="{ item }">
      <tr>
        <td>{{ item.fechaFormateada }}</td>
        <td :class="{ descuadre: item.cmp_monto !== item.cyl_monto }">{{ item.cmp_monto }}</td>
        <td :class="{ descuadre: item.cmp_cantidad !== item.cyl_cantidad }">{{ item.cmp_cantidad }}</td>
        <td :class="{ descuadre: item.cmp_monto !== item.cyl_monto }">{{ item.cyl_monto }}</td>
        <td :class="{ descuadre: item.cmp_cantidad !== item.cyl_cantidad }">{{ item.cyl_cantidad }}</td>
        <td>{{ item.trx }} %</td>
        <td>{{ item.cyl_locales }}</td>
        <td>
          <v-btn small @click="openDetalleFechaHome(item.fecha)">Ver Detalle</v-btn>
        </td>
      </tr>
    </template>
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title class="rdmqc">Bienvenido BBR / EVERTEC.</v-toolbar-title>
        </v-toolbar>

        <v-expansion-panels class="pb-3">
          <v-expansion-panel>
            <v-expansion-panel-header>
              <i class="pe-7s-edit"></i> Filtros
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-container fluid>
                <v-row align="center">
                  <v-col cols="12" sm="3" class="text-center my-auto">
                    <v-select
                      label="Rango de Fecha"
                      v-model="selectedDateRange"
                      :items="['Hoy', 'Ayer', 'Últimos 7 días', 'Este mes', 'Mes pasado']"
                      @change="onDateRangeChange"
                      clearable
                      dense
                    ></v-select>
                  </v-col>
                  
                  <v-col cols="12" sm="2" class="text-center my-auto">
                    <v-menu
                      v-model="menu1"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          class="font-class-name"
                          label="Desde"
                          prepend-icon="event"
                          readonly
                          v-on="on"
                          clearable
                          @click:clear="clearStartDate"
                          v-model="startDateFormatted"
                          :height="50"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="startDate"
                        @input="menu1 = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                  
                  <v-col cols="12" sm="2" class="text-center my-auto">
                    <v-menu
                      v-model="menu2"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          class="font-class-name"
                          label="Hasta"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-on="on"
                          clearable
                          @click:clear="clearEndDate"
                          v-model="endDateFormatted"
                          :height="50"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="endDate"
                        @input="menu2 = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>

                  <v-col cols="12" sm="2" class="text-center my-auto">
                    <v-autocomplete
                      label="Cadenas"
                      class="font-class-name1"
                      v-model="cadenaFilterValue"
                      :items="chainOptions"
                      item-text="value"
                      item-value="id"
                      clearable
                      dense
                      :height="50"
                    ></v-autocomplete>
                  </v-col>

                  <v-col cols="12" sm="2" class="text-center my-auto">
                    <v-select
                      label="Estado"
                      class="font-class-name1"
                      v-model="estadoFilterValue"
                      :items="['Todos', 'Cuadrados', 'Descuadrados']"
                      clearable
                      dense
                      :height="50"
                    ></v-select>
                  </v-col>

                  <v-row justify="end" class="my-auto">
                    <!-- Botón Buscar -->
                    <v-col cols="auto">
                      <v-btn color="primary" @click="obtenerResumen" :disabled="isButtonDisabled">
                        <v-icon left>pe-7s-search</v-icon> Buscar
                      </v-btn>
                    </v-col>
                  
                    <!-- Botón Exportar -->
                    <v-col cols="auto">
                      <b-button variant="success" @click="exportarPlanilla">
                        <v-icon dark>mdi-microsoft-excel</v-icon> Exportar
                      </b-button>
                    </v-col>
                  
                    <!-- Botón Limpiar -->
                    <v-col cols="auto">
                      <v-btn color="warning" @click="clearFields">
                        <i class="pe-7s-refresh-2 btn-icon-wrapper"></i> Limpiar
                      </v-btn>
                    </v-col>
                  </v-row>                  
                  
                  <br><br><br>
                </v-row>
              </v-container>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </template>
  </v-data-table>

  <DetalleFechaHome v-if="detalleFecha" :fecha="detalleFecha" />

    <div class="totals-section">
      <br>
      <v-row>
        <v-col class="text-right" cols="12">
          <v-row>
            <v-col>Monto Total: {{ formatAmount(totalTesoreriaMonto) }}</v-col>
            <v-col>Cantidad Total: {{ totalTesoreriaQty }}</v-col>
            <v-col>CYL Monto Total: {{ formatAmount(totalCylMonto) }}</v-col>
            <v-col>CYL Cantidad Total: {{ totalCylCantidad}}</v-col>
            <v-col>CYL Locales Total: {{ totalCylLocales}}</v-col>
          </v-row>
        </v-col>
      </v-row>
    </div>

  </div>

</template>

<script>
import axios from 'axios';
import VueElementLoading from 'vue-element-loading';
import moment from 'moment'; 
import config from '../../config.js';
import consvenmen from '../services/consvenmen';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';

const XLSX = require('xlsx');
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

  components: {
    VueElementLoading,
  },
  data() {
    return {
      loader: false,
      loadTable: false,
      selected: [],
      tableHeaders: [
        { text: 'Fecha', value: 'fechaISO' },
        { text: 'Tesorería Monto '+config.symbolMoney, value: 'cmp_monto' },
        { text: 'Tesorería Qty', value: 'cmp_cantidad' },
        { text: 'CYL Monto '+config.symbolMoney, value: 'cyl_monto' },
        { text: 'CYL Cantidad', value: 'cyl_cantidad' },
        { text: 'Trx %', value: 'trx' },
        { text: 'CYL Locales', value: 'cyl_locales' },
        { text: 'Detalle', value: 'actions',  }
      ],
      detalleFecha: null,
      desserts: [],
      search: '',
      menu1: false,
      menu2: false,
      startDate: null,
      endDate: null,
      cadenaFilterValue: null,
      cadenas: [],
      estadoFilterValue: 'Todos',
      showAlert: false,
      selectedDateRange: null,
    };
  },
  computed: {
    isButtonDisabled() {
    const start = this.startDate ? moment(this.startDate) : null;
    const end = this.endDate ? moment(this.endDate) : null;
    
    if (!start || !end) {
      return true; 
    }

    const isEndDateBeforeStartDate = start.isAfter(end);
    const isDateRangeTooLarge = end.diff(start, 'days') > 31;
    
    return isEndDateBeforeStartDate || isDateRangeTooLarge; 
  },
  startDateFormatted: {
    get() {
      return this.startDate ? moment(this.startDate).format('DD/MM/YYYY') : '';
    },
    set(value) {
      if (value) {
        const date = moment(value, 'DD/MM/YYYY');
        if (date.isValid()) {
          this.startDate = date.toDate();
        } else {
          this.startDate = null;
        }
      } else {
        this.startDate = null;
      }
    }
  },
  endDateFormatted: {
      get() {
        return this.endDate ? moment(this.endDate).format('DD/MM/YYYY') : '';
      },
      set(value) {
        if (value) {
          const date = moment(value, 'DD/MM/YYYY');
          if (date.isValid()) {
            this.endDate = date.toDate();
          } else {
            this.endDate = null;
          }
        } else {
          this.endDate = null;
        }
      }
    },
  totalTesoreriaMonto() {
        return this.desserts.reduce((sum, item) => sum + Number(item.cmp_monto || 0), 0.0).toFixed(2);
    },
  totalTesoreriaQty() {
        return this.desserts.reduce((sum, item) => sum + Number(item.cmp_cantidad || 0), 0);
    },
  totalCylMonto() {
        return this.desserts.reduce((sum, item) => sum + Number(item.cyl_monto || 0), 0.0).toFixed(2);
    },
  totalCylCantidad() {
        return this.desserts.reduce((sum, item) => sum + Number(item.cyl_cantidad || 0), 0);
    },
  totalCylLocales() {
        return this.desserts.reduce((sum, item) => sum + Number(item.cyl_locales || 0), 0);
    },
  isDateRangeSelected() {
        return this.startDate && this.endDate;
    },
},

watch: {
  
  startDate(newVal) {
    if (newVal && this.endDate) {
      this.validateDateRange();
    }
  },
  endDate(newVal) {
    if (newVal && this.startDate) {
      this.validateDateRange();
    }
  }
},

filters: {
  formatDate(value) {
    return moment(value).format('DD/MM/YYYY');
  }
},
methods: {

    async cargarValoresDesdeLocalStorage() {
      
      await this.loadCadenas();
      const valoresGuardados = localStorage.getItem('valoresFiltro');
      
      if (valoresGuardados) {
        const valores = JSON.parse(valoresGuardados);
        this.startDate = valores.startDate;
        this.endDate = valores.endDate;
        this.cadenaFilterValue = valores.cadenaFilterValue;
        this.estadoFilterValue = valores.estadoFilterValue;
        this.selectedDateRange = valores.selectedDateRange;
  
      }

      const datosTablaGuardados = localStorage.getItem('datosTabla');
        if (datosTablaGuardados) {
          this.desserts = JSON.parse(datosTablaGuardados);
        }
    },

    guardarValoresEnLocalStorage() {
      const valores = {
        startDate: this.startDate,
        endDate: this.endDate,
        cadenaFilterValue: this.cadenaFilterValue,
        estadoFilterValue: this.estadoFilterValue,
        selectedDateRange: this.selectedDateRange,

      };
      localStorage.setItem('valoresFiltro', JSON.stringify(valores));
      localStorage.setItem('datosTabla', JSON.stringify(this.desserts));
    },

    validateDateRange() {
      this.showAlert = false; 
      const start = this.startDate ? moment(this.startDate) : null;
      const end = this.endDate ? moment(this.endDate) : null;

    if (start.isAfter(end)) {
        toastr.error('La fecha término del periodo debe ser mayor a la fecha de inicio','Error' );
      } else if (end.diff(start, 'days') > 31) {
        toastr.error('El rango de fechas no debe ser mayor a 31 días', 'Error');
      } 
    },
    formatAmount(amount) {
        return `${config.symbolMoney}${Number(amount).toFixed(config.decimalQty)}`;
       },
    exportarPlanilla() {

    if (this.desserts.length === 0) {
        toastr.warning('No hay registros para exportar');
        return;
    }

    const newTable = this.desserts.map(item => {
    return {
          'Fecha': item.fechaISO,
          'Tesorería Monto ': item.cmp_monto,
          'Tesorería Qty': item.cmp_cantidad,
          'CYL Monto': item.cyl_monto,
          'CYL Cantidad': item.cyl_cantidad,
          'Trx %': Math.round((item.cyl_cantidad / item.cmp_cantidad) * 100), 
          'CYL Locales': item.cyl_locales,
        };
      });

    const ws = XLSX.utils.json_to_sheet(newTable);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "Reporte.xlsx");
    },
    
    onDateRangeChange() {
    const today = moment();
      switch(this.selectedDateRange) {
        case 'Hoy':
          this.startDate = today;
          this.endDate = today;
          break;
        case 'Ayer':
          this.startDate = moment().subtract(1, 'days');
          this.endDate = moment().subtract(1, 'days');
          break;
        case 'Últimos 7 días':
          this.startDate = moment().subtract(7, 'days');
          this.endDate = today;
          break;
        case 'Este mes':
          this.startDate = moment().startOf('month');
          this.endDate = moment().endOf('month');
          break;
        case 'Mes pasado':
          this.startDate = moment().subtract(1, 'months').startOf('month');
          this.endDate = moment().subtract(1, 'months').endOf('month');
          break;
      }
    },

    clearStartDate() {
      this.startDate = null;
      this.clearSelectedDateRange();
    },
    clearEndDate() {
      this.endDate = null;
      this.clearSelectedDateRange();
    },

    openDetalleFechaHome(fecha) {
    this.$router.push({ 
        name: 'DetalleFechaHome', 
        params: { 
            fecha: fecha, 
            idCadena:  this.cadenaFilterValue
        } 
    });

    },
    async loadCadenas() {
      const response = await consvenmen.fetchChains();
      this.chainOptions = response;
      console.log('fetchChains:', this.chainOptions);
    },

    async obtenerResumen() {
      if (this.startDate && this.endDate) {
        try {

          console.log('startDateFormatted:', this.startDateFormatted);
          console.log('endDateFormatted:', this.endDateFormatted);

          let payload = {
            fechaInicio: moment(this.startDateFormatted, 'DD/MM/YYYY').format('YYYY-MM-DD'),
            fechaFin: moment(this.endDateFormatted, 'DD/MM/YYYY').format('YYYY-MM-DD'),
            idCadena: this.cadenaFilterValue !== null ? this.cadenaFilterValue : -1,
          };

          console.log('payload:', payload);

          let response = await axios.post(`${VUE_APP_BASE_API_URL_HOME}/resumen`, payload);
           
          if(response.data.length === 0) {
            toastr.warning('No se encontraron resultados.');
          } 

          console.log('response:', response.data);

          this.desserts = response.data.map(item => {
            return {
              ...item,
              fechaISO: moment(item.fecha).format('YYYY-MM-DD'),
              fechaFormateada: moment(item.fecha).format('DD/MM/YYYY'),
              cmp_monto: Number(item.cmp_monto).toFixed(2),
              cyl_monto: Number(item.cyl_monto).toFixed(2),
              cmp_cantidad: Number(item.cmp_cantidad),
              cyl_cantidad: Number(item.cyl_cantidad),
              trx: Number(Math.round((item.cyl_cantidad / item.cmp_cantidad) * 100)),
              cyl_locales: Number(item.cyl_locales),
            };
          });

          console.log('desserts:', this.desserts);

      if (this.estadoFilterValue === 'Cuadrados') {
        this.desserts = this.desserts.filter(item => {
          return item.cmp_monto === item.cyl_monto && item.cmp_cantidad === item.cyl_cantidad;
        });
      } else if (this.estadoFilterValue === 'Descuadrados') {
        this.desserts = this.desserts.filter(item => {
          return item.cmp_monto !== item.cyl_monto || item.cmp_cantidad !== item.cyl_cantidad;
        });
      }
  
      this.loadTable = false;
       this.guardarValoresEnLocalStorage();
      
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  } else {
    console.error('Fecha inicio y/o Fecha fin no son válidas');
  }
},

clearFields() {

    this.startDate = null;
    this.endDate = null;
    this.menu1 = false;
    this.menu2 = false;
    this.cadenaFilterValue = null;
    this.estadoFilterValue = 'Todos';
    this.selectedDateRange = null;
    this.desserts = [];

  },

clearSelectedDateRange() {
    this.selectedDateRange = null;
  },

  },
  mounted() {
    this.obtenerResumen();
    this.cargarValoresDesdeLocalStorage();
  },
  
};
</script>

<style>
  .button-container {
    position: absolute;
    margin-left: 600px;
    width: 200px;
  }

  .descuadre {
    color: red;
  }
  
</style>
