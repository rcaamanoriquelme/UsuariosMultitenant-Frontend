<template>
  <div>
    <v-toolbar flat color="white">
            <v-toolbar-title class="rdmqc">Informe de comisiones Medios de Pago</v-toolbar-title>
      </v-toolbar>
    <v-expansion-panels class="pb-3">
    <v-expansion-panel>     
        <v-expansion-panel-header><i class="pe-7s-edit"> Filtros</i></v-expansion-panel-header>
        <v-expansion-panel-content>
    <v-row>
      <v-col cols="12" md="3" class="pa-2">
        <v-menu v-model="menuStart" :close-on-content-click="false">
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="formattedStartDate"
              label="Fecha inicial"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="startDate" @input="menuStart = false"></v-date-picker>
        </v-menu>
      </v-col>

      <v-col cols="12" md="3" class="pa-2">
        <v-menu v-model="menuEnd" :close-on-content-click="false">
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="formattedEndDate"
              label="Fecha final"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="endDate" @input="menuEnd = false"></v-date-picker>
        </v-menu>
      </v-col>

      <v-col cols="12" md="3" class="pa-2">
        <v-autocomplete
          label="Cadena"
          v-model="chainSelected"
          :items="chainOptions"
          item-text="value"
          item-value="id"
          clearable
          dense
          @change="fetchLocals"
        ></v-autocomplete>
      </v-col>

      <v-col cols="12" md="3" class="pa-2">
        <v-autocomplete
          label="Local"
          v-model="localSelected"
          :items="localOptions"
          item-text="value"
          item-value="id"
          clearable
          dense
        ></v-autocomplete>
      </v-col>

      <v-col cols="12" md="3" class="pa-2">
        <v-select
          v-model="selectedIssuer"
          :items="issuerOptions"
          label="Emisor"
          item-text="value"
          item-value="id"
        ></v-select>
      </v-col>

      <v-col cols="12" md="3" class="pa-2">
        <v-select
          v-model="idTarjeta"
          :items="cardOptions"
          label="Tarjeta"
          item-text="tar_nombre"
          item-value="id_tarjeta"
        ></v-select>
      </v-col>

      <v-col cols="12" md="3" class="pa-2">
        <v-select
          v-model="idTipoTrx"
          :items="transactionTypeOptions"
          label="Tipo de Transacción"
        ></v-select>
      </v-col>
   
       <v-col cols="12" md="3" class="pa-2">
        <v-select v-model="estadoCon" :items="estadoConOptions" label="Estado de Conciliación" item-text="text" item-value="value"></v-select>
      </v-col>

      <v-col cols="12" md="3" class="pa-2">
        <v-select v-model="estadoLiq" :items="estadoLiqOptions" label="Estado de Liquidación"  item-text="text" item-value="value"></v-select>
      </v-col>
      
      <v-col cols="12" md="3" class="pa-2">
      <v-checkbox v-model="showTable" label="Detalle"></v-checkbox>
      </v-col>

    </v-row>

    <v-row class="pa-6 justify-end">
      <v-btn class="w-15 ms-1 search-button" color="primary" @click="fetchTransactions" :disabled="isSearchDisabled" ><v-icon left>pe-7s-search</v-icon>Buscar</v-btn>
      <v-btn class="w-15 ms-2 export-button" color="success" @click="downloadExcel"><v-icon left>mdi-microsoft-excel</v-icon>Exportar</v-btn>
      <v-btn class="w-15 ms-2 export-button" color="warning" @click="clearFields">
        <i class="pe-7s-refresh-2 btn-icon-wrapper"></i>
          Limpiar
      </v-btn>
    </v-row>

    </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
  <v-progress-linear :indeterminate="loading" color="primary"></v-progress-linear>
   <v-data-table  v-if="showTable" :headers="tableHeaders" :items="transactions" class="elevation-1">
    
   </v-data-table>

    <v-data-table  v-if="!showTable" :headers="tableHeadersTotales" :items="transactionsTotales" class="elevation-1">
      <template v-slot:item.monto="{ item }">
        {{ formatAmount(item.monto) }}
      </template>
      <template v-slot:item.monto_comision="{ item }">
        {{ formatAmount(item.monto_comision) }}
      </template>
      <template v-slot:item.monto_impuesto="{ item }">
        {{ formatAmount(item.monto_impuesto) }}
      </template>
      <template v-slot:item.monto_neto="{ item }">
        {{ formatAmount(item.monto_neto) }}
      </template>
    </v-data-table>
  </div>
</template>

<script>
import * as api from '../services/infomedpag';
import config from '../../config.js';
import { format } from 'date-fns';
const XLSX = require('xlsx');
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';

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
      loading: false,
      menuStart: false,
      menuEnd: false,
      startDate: null,
      endDate: null,
      chainSelected: null,
      localSelected: null,
      selectedIssuer: null,
      idTarjeta: null,
      idTipoTrx: null,
      showTable: false,
      chainOptions: [],
      localOptions: [],
      issuerOptions: [],
      cardOptions: [],
      transactionTypeOptions: [],
      transactions: [],
      transactionsTotales: [],
      tableHeaders: [
        { text: 'Nombre Cadena', value: 'cad_nombre' },
        { text: 'Nombre Local', value: 'loc_nombre' },
        { text: 'Nombre Emisor', value: 'emi_nombre' },
        { text: 'Fecha Transacción', value: 'trx_fecha' },
        { text: 'POS', value: 'trx_pos' },
        { text: 'Nombre Tarjeta', value: 'tar_nombre' },
        { text: 'Boleta', value: 'trx_boleta' },
        { text: 'Cantidad', value: 'cantidad' },
        { text: 'Monto Transacción '+config.symbolMoney, value: 'trx_monto' },
        { text: 'Monto Comisión '+config.symbolMoney, value: 'monto_comision' },
        { text: 'Monto Impuesto '+config.symbolMoney, value: 'monto_impuesto' },
        { text: 'Monto Neto '+config.symbolMoney, value: 'monto_neto' }
        ],

      tableHeadersTotales: [
        { text: 'Cantidad', value: 'cantidad' },
        { text: 'Monto '+config.symbolMoney, value: 'monto' },
        { text: 'Comisión '+config.symbolMoney, value: 'monto_comision' },
        { text: 'Impuesto '+config.symbolMoney, value: 'monto_impuesto' },
        { text: 'Neto '+config.symbolMoney, value: 'monto_neto' },
        
        ],
      estadoConOptions: [
        { text: 'Anulada', value: 'ANU' },
        { text: 'Castigada', value: 'CAS' },
        { text: 'Conciliada', value: 'CON' },
        { text: 'Desconocida', value: 'DES' },
        { text: 'Litigio', value: 'LIT' },
        { text: 'Pendiente', value: 'PEN' },
        { text: 'Pre-litigio', value: 'PRE' },
        { text: 'Recibida', value: 'REC' },
      ],
      estadoLiqOptions: [
        { text: 'Anulada', value: 'ANU' },
        { text: 'Castigada', value: 'CAS' },
        { text: 'Recibida', value: 'REC' },
        { text: 'Liquidada', value: 'LIQ' },
        { text: 'No se liquida', value: 'NLI' },
        { text: 'Liq. parcial', value: 'LIP' },
        { text: 'Retenida', value: 'RET' },
        { text: 'Ret. parcial', value: 'REP' },
      ]
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
      return !this.startDate || !this.endDate;
    }
  },
  methods: {

    formatDate(dateStr) {
      if (!dateStr) return null;
      const [year, month, day] = dateStr.split('-').map(Number);
      const date = new Date(year, month - 1, day); 
      return format(date, 'dd/MM/yyyy');
      },

    formatAmount(amount) {
        return `${Number(amount).toFixed(config.decimalQty)}`;
       },

    downloadExcel() {
    
      if(this.showTable === true ) {
      if (this.transactions.length === 0) {
          toastr.warning('No hay registros para exportar');
          return;
        }
        const workSheet = XLSX.utils.json_to_sheet(this.transactions);
              const workBook = XLSX.utils.book_new();
              XLSX.utils.book_append_sheet(workBook, workSheet, "Transactions");
              let titles = this.tableHeaders.map(header => header.text);
              XLSX.utils.sheet_add_aoa(workSheet, [titles], {origin: 'A1'});
              XLSX.writeFile(workBook, 'transacciones_detalle.xlsx');
      
        } else {
            if (this.transactionsTotales.length === 0) {
              toastr.warning('No hay registros para exportar');
              return;
            }
            const workSheet = XLSX.utils.json_to_sheet(this.transactionsTotales);
                const workBook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workBook, workSheet, "Transactions");
                let titles = this.tableHeadersTotales.map(header => header.text);
                XLSX.utils.sheet_add_aoa(workSheet, [titles], {origin: 'A1'});
                XLSX.writeFile(workBook, 'transacciones_totales.xlsx');
            }
          }
      ,
      async fetchChains() {
        this.chainOptions = await api.fetchChains();
        console.log(this.chainOptions);
      },
      async fetchLocals() {
        this.localOptions = await api.fetchLocals(this.chainSelected);
      },
      async fetchIssuers() {
        this.issuerOptions = await api.fetchIssuers();
      },
      async fetchCards() {
        if(this.selectedIssuer) {
          this.cardOptions = await api.fetchCards(this.selectedIssuer);
          console.log(this.cardOptions);
        } else {
          this.cardOptions = [];
        }
      },
      async fetchTransactionTypes() {
        const response = await api.fetchTransactionTypes();
        this.transactionTypeOptions = response.map(item => ({
          value: item.id_tipotrx, 
          text: item.ttx_nombre 
        }));
      },

      async fetchTransactions() {

        this.loading = true;

        // Verifica si la fecha de inicio es posterior a la fecha de fin
        if (new Date(this.startDate) > new Date(this.endDate)) {
          toastr.error('La fecha inicial no puede ser posterior a la fecha final.');
          return;
        }

        // Verifica si el rango de fechas es demasiado grande
        const diffTime = Math.abs(new Date(this.endDate) - new Date(this.startDate));
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays > 31) {
          toastr.error('El rango de fechas no debe ser mayor a 31 días.');
          return;
        }
        const payload = {
          idUsuario: -1,
          idCadena: this.chainSelected || -1,
          idLocal: this.localSelected || -1,
          idEmisor: this.selectedIssuer || -1,
          idTarjeta: this.idTarjeta || -1,
          idTipoTrx: this.idTipoTrx || -1,
          startDate: this.startDate,
          endDate: this.endDate,
          estado_con: this.estadoCon || "",
          estadi_liq: this.estadoLiq || ""
        };

        if(this.showTable === true ) {

        try {
          this.transactions = await api.fetchTransactions(payload);
          console.log(this.transactions);
          if (this.transactions.length === 0) {
            toastr.warning('No se encontraron resultados');
          }
        } catch (error) {
          console.error(error);
          this.loading = false;
        }
        this.loading = false;
      }
      else {
        try {
          this.transactionsTotales = await api.fetchTransactionsTotales(payload);
          console.log(this.transactions);
          if (this.transactionsTotales.length === 0) {
            toastr.warning('No se encontraron resultados');
          }
        } catch (error) {
          console.error(error);
          this.loading = false;
        }
      }
        this.loading = false;
    },
    clearFields() {
      this.startDate = null;
      this.endDate = null;
      this.chainSelected = null;
      this.localSelected = null;
      this.selectedIssuer = null;
      this.idTarjeta = null;
      this.idTipoTrx = null;
      this.estadi_liq = null;
      this.estado_con = null;
      this.transactions = []; 
      this.transactionsTotales = [];
    },
  },
  created() {
    this.fetchChains();
    this.fetchIssuers();
    this.fetchTransactionTypes();
  },
  watch: {
    selectedIssuer: function (newVal) {
      if (newVal) {
        this.fetchCards();
      }
    }
  },
};
</script>
