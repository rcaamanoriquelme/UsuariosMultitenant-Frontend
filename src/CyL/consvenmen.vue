<template>
  <div>
    <v-toolbar flat color="white">
          <v-toolbar-title class="rdmqc">Ventas Mensuales</v-toolbar-title>
    </v-toolbar>
    <v-expansion-panels class="pb-3">
      <v-expansion-panel>
        <v-expansion-panel-header><i class="pe-7s-edit"> Filtros</i></v-expansion-panel-header>
        <v-expansion-panel-content>
        <v-row>
            <v-col cols="12" md="6" class="pa-6">
              <v-menu v-model="menuStart" :close-on-content-click="false">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    :value="formattedStartDate"
                    label="Fecha inicial"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="startDate" @input="menuStart = false"></v-date-picker>
              </v-menu>

              <v-autocomplete
                label="Cadena"
                class="font-class-name1"
                v-model="chainSelected"
                :items="chainOptions"
                item-text="value"
                item-value="id"
                clearable
                dense
                @change="getLocales"
              ></v-autocomplete>

              <v-autocomplete
                label="Local"
                class="font-class-name1"
                v-model="localSelected"
                :items="localOptions"
                item-text="value"
                item-value="id"
                clearable
                dense
              ></v-autocomplete>

              <v-text-field
                label="Pedido Vtex"
                v-model="vtexOrder"
                class="font-class-name1"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="6" class="pa-6">
              <v-menu v-model="menuEnd" :close-on-content-click="false">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    :value="formattedEndDate"
                    label="Fecha final"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="endDate" @input="menuEnd = false"></v-date-picker>
              </v-menu>

              <v-autocomplete
                label="Emisor"
                class="font-class-name1"
                v-model="issuerSelected"
                :items="issuerOptions"
                item-text="value"
                item-value="id"
                clearable
                dense
                @change="getOperators"
              ></v-autocomplete>

              <v-autocomplete
                label="Operador"
                class="font-class-name1"
                v-model="operatorSelected"
                :items="operatorOptions"
                item-text="value"
                item-value="id"
                clearable
                dense
              ></v-autocomplete>
            </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" class="text-right my-auto">
                <v-spacer></v-spacer>
                <v-btn 
                  class="w-15 ms-1 search-button" 
                  color="primary" 
                  @click="fetchTransactions"
                  :disabled="isSearchDisabled">
                    <v-icon left>pe-7s-search</v-icon> 
                    Buscar
                </v-btn>      
                <v-btn class="w-15 ms-2 export-button" color="success" @click="downloadExcel">
                  <v-icon left>mdi-microsoft-excel</v-icon> 
                  Exportar
                </v-btn>

                <v-btn class="w-15 ms-2 export-button" color="warning" @click="clearFields">
                  <i class="pe-7s-refresh-2 btn-icon-wrapper"></i>
                  Limpiar
                </v-btn>
              </v-col>
            </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>     
        <br><br>
        <v-data-table :headers="tableHeaders" :items="transactions" class="elevation-1">
          <template v-slot:item.amount="{ item }">
            {{ formatAmount(item.amount) }}
          </template>
        </v-data-table>
  </div>
</template>

<script>
const XLSX = require('xlsx');
import consvenmen from '../services/consvenmen';
import { format } from 'date-fns';
import config from '../../config.js';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
import moment from 'moment';

toastr.options = {
  closeButton: true,
  progressBar: true,
  positionClass: 'toast-top-right',
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
      menuStart: false,
      menuEnd: false,
      startDate: null,
      endDate: null,
      chainSelected: null,
      localSelected: null,
      vtexOrder: null,
      issuerSelected: null,
      operatorSelected: null,
      chainOptions: [],
      localOptions: [],
      issuerOptions: [],
      operatorOptions: [],
      transactions: [],
      tableHeaders: [
        { text: 'Pedido Vtex', value: 'vtexOrder' },
        { text: 'Fecha', value: 'date' },
        { text: 'Sucursal', value: 'branch' },
        { text: 'Nombre local', value: 'localName' },
        { text: 'Caja', value: 'box' },
        { text: 'Secuencia', value: 'sequence' },
        { text: 'N Tarjeta', value: 'cardNumber' },
        { text: 'Doc Venta', value: 'saleDocument' },
        { text: 'Cod Autor', value: 'authCode' },
        { text: 'RUC', value: 'ruc' },
        { text: 'Tipo Venta', value: 'saleType' },
        { text: 'Importe '+config.symbolMoney, value: 'amount' },
      ],
    };
  },
  computed: {
    formattedStartDate() {
        return this.startDate ? this.formatDate(this.startDate) : null;
      },
    formattedEndDate() {
        return this.endDate ? this.formatDate(this.endDate) : null;
      },
    isSearchDisabled() {
    return !(this.startDate && this.endDate && this.issuerSelected && this.operatorSelected);
    }
  },
  methods: {

    formatDate(dateStr) {
    if (!dateStr) return null;
    
        if (dateStr instanceof Date) {
          dateStr = format(dateStr, 'yyyy-MM-dd');
        }

        if (typeof dateStr === 'string') {
          const [year, month, day] = dateStr.split('-').map(Number);
          const date = new Date(year, month - 1, day);
          return format(date, 'dd/MM/yyyy'); 
        }
        return null; 
      },

      formatDateTable(dateStr) {
          if (!dateStr) return null;

          let date;
          if (dateStr instanceof Date) {
            date = dateStr;
          } else if (typeof dateStr === 'string') {
            // Suponiendo que la fecha viene en formato DD/MM/AAAA
            const parts = dateStr.split('/');
            if (parts.length === 3) {
              date = new Date(parts[2], parts[1] - 1, parts[0]);
            } else {
              return null; // Formato no reconocido
            }
          } else {
            return null; // Tipo no soportado
          }

          return format(date, 'dd/MM/yyyy');
        },

    formatAmount(amount) {
        return `${Number(amount).toFixed(config.decimalQty)}`;
       },
    async fetchChains() {
      const response = await consvenmen.fetchChains();
      this.chainOptions = response;
    },
    async getLocales() {
      if (this.chainSelected) {
        const response = await consvenmen.fetchLocales(this.chainSelected);
        this.localOptions = response.data;
      } else {
        this.localOptions = [];
      }
    },
    async fetchEmitters() {
      const response = await consvenmen.fetchEmitters();
      this.issuerOptions = response.data;
    },
    async getOperators() {
      if (this.issuerSelected) {
        const response = await consvenmen.fetchOperators(this.issuerSelected);
        this.operatorOptions = response.data;
      } else {
        this.operatorOptions = [];
      }
    },
    clearFields() {
      this.startDate = null;
      this.endDate = null;
      this.chainSelected = null;
      this.localSelected = null;
      this.vtexOrder = null;
      this.issuerSelected = null;
      this.operatorSelected = null;
      this.transactions = [];
    },

    async fetchTransactions() {
      if (!this.startDate || !this.endDate  || !this.issuerSelected|| !this.operatorSelected) {
        toastr.error('Por favor, selecciona todos los campos obligatorios.');
        return;
      }

      const start = new Date(this.startDate);
      const end = new Date(this.endDate);
      
      if (start > end) {
        toastr.error('La fecha inicial no puede ser posterior a la fecha final.');
        return;
      }

      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      
      if (diffDays > 31) {
        toastr.error('El rango de fechas no debe ser mayor a 31 días.');
        return;
      }

      const payload = {
        fechaInicial: this.formattedStartDate,
        fechaFinal: this.formattedEndDate,
        id_cadena: this.chainSelected || null,
        local: this.localSelected || null,
        pedidoVtex: this.vtexOrder || null,
        id_emisor: this.issuerSelected || null,
        id_operador: this.operatorSelected || null,
      };

      try {

        const response = await consvenmen.fetchTransactions(payload);

        if(!response.data.length) {
          toastr.warning('No se encontraron resultados.');
          this.transactions = [];
          return;
        }
        
        this.transactions = response.data.map(item => ({
              vtexOrder: item.hed_ecompedido,
              date: moment(item.hed_fcontable, 'DD/MM/YYYY').format('DD/MM/YYYY'),
              branch: item.hed_local,
              localName: item.loc_descripcion,
              box: item.hed_pos,
              sequence: item.hed_numtrx,
              cardNumber: item.pag_numcta,
              saleDocument: item.hed_tipotrx,
              authCode: item.cod_autor,
              ruc: item.hed_ecomruc,
              saleType: item.tpa_despago,
              amount: item.pag_monto,
            }));

        console.log(this.transactions);

      } catch (error) {
        console.error(error);
      }
    },
    downloadExcel() {

      if (this.transactions.length === 0) {
          toastr.warning('No hay registros para exportar');
          return;
        }
        const workSheet = XLSX.utils.json_to_sheet(this.transactions);
        const workBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workBook, workSheet, "Transactions");
        
        // Define los títulos de las columnas
        let titles = this.tableHeaders.map(header => header.text);
        XLSX.utils.sheet_add_aoa(workSheet, [titles], {origin: 'A1'});
        
        // Descargar el archivo
        XLSX.writeFile(workBook, 'Ventas.xlsx');
      }
  },
  created() {
    this.fetchChains();
    this.fetchEmitters();
  },
};

</script>

<style scoped>
.font-class-name1 {
  font-size: 1.2rem !important;
}
.button {
  height: 5.5vh !important;
}
.button-primary {
  background-color: blue !important; 
  color: white !important; 
}

.button-primary:hover {
  background-color: darkblue !important; 
}

.button-success {
  background-color: green !important; 
  color: white !important; 
}

.button-success:hover {
  background-color: darkgreen !important; 
}

.button-error {
  background-color: red !important; 
  color: white !important; 
}

.button-error:hover {
  background-color: darkred !important; 
}

</style>
