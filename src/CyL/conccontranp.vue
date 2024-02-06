<template>
    <div>
      <v-toolbar flat color="white">
            <v-toolbar-title class="rdmqc">Consulta de Transacciones</v-toolbar-title>
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
                v-model="formattedStartDate"
                label="Fecha de inicio"
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
            required
            @change="fetchLocals"
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
            required
          ></v-autocomplete>
        </v-col>
        <v-col cols="12" md="6" class="pa-6">
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
  
          <v-autocomplete
            label="Emisor"
            v-model="issuerSelected"
            :items="issuerOptions"
            item-text="value"
            item-value="id"
            clearable
            dense
            required
          ></v-autocomplete>
        </v-col>
      </v-row>

  <v-row>
    <v-col cols="12" md="6" class="pa-6">
      <v-select
        v-model="estadoConSelected"
        :items="estadoConOptions"
        item-text="name"
        item-value="code"
        label="Estado Con"
      ></v-select>
    </v-col>
    <v-col cols="12" md="6" class="pa-6">
      <v-select
        v-model="estadoLiqSelected"
        :items="estadoLiqOptions"
        item-text="name"
        item-value="code"
        label="Estado Liq"
      ></v-select>
    </v-col>

    <v-col cols="12">
        <v-row justify="end">
          <v-btn :disabled="isSearchDisabled" class="w-15 ms-1 search-button" color="primary" @click="fetchPayments">
            <v-icon left>pe-7s-search</v-icon> Buscar
          </v-btn>          
          <v-btn class="w-15 ms-2 export-button" color="success" @click="downloadExcel">
            <v-icon left>mdi-microsoft-excel</v-icon> Exportar
          </v-btn>
        </v-row>
      </v-col>
    </v-row>
    </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
  <br>     
    <v-data-table :headers="tableHeaders" :items="payments" class="elevation-1 mb-12">
      <template v-slot:item.pag_fecha="{ item }">
        {{ formatDate(item.pag_fecha) }}
      </template>
      <template v-slot:item.pag_monto="{ item }">
        {{ formatAmount(item.pag_monto) }}
      </template>
    </v-data-table>
  </div>
  </template>
  
  <script>
  const XLSX = require('xlsx');
  import {
    fetchLocals,
    fetchIssuers,
    fetchPayments,
  } from '@/services/conccontranp';
  import { format } from 'date-fns';
  import consvenmen from '../services/consvenmen';
  import config from '../../config.js';
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
        chainOptions: [],
        localOptions: [],
        issuerOptions: [],
        chainSelected: null,
        localSelected: null,
        issuerSelected: null,
        startDate: null,
        endDate: null,
        menuStart: false,
        menuEnd: false,
        payments: [],
        tableHeaders: [
          { text: 'Fecha', value: 'pag_fecha' },
          { text: 'Cadena', value: 'cad_nombre' },
          { text: 'Local', value: 'loc_nombre' },
          { text: 'Emisor', value: 'emi_nombre' },
          { text: 'Transacción', value: 'ttx_nombre' },
          { text: 'POS', value: 'pag_pos' },
          { text: 'Número de transacción', value: 'pag_numero_trx' },
          { text: 'Comprobante', value: 'pag_comprobante' },
          { text: 'Monto', value: 'pag_monto' },
          { text: 'Estado', value: 'ecn_descripcion' },
        ],

      estadoConSelected: [],
      estadoLiqSelected: [],
      estadoConOptions: [
        { name: 'Anulada', code: 'ANU' },
        { name: 'Castigada', code: 'CAS' },
        { name: 'Conciliada', code: 'CON' },
        { name: 'Desconocida', code: 'DES' },
        { name: 'Litigio', code: 'LIT' },
        { name: 'Pendiente', code: 'PEN' },
        { name: 'Pre-litigio', code: 'PRE' },
        { name: 'Recibida', code: 'REC' },
      ],
      estadoLiqOptions: [
        { name: 'Anulada', code: 'ANU' },
        { name: 'Castigada', code: 'CAS' },
        { name: 'Recibida', code: 'REC' },
        { name: 'Liquidada', code: 'LIQ' },
        { name: 'No se liquida', code: 'NLI' },
        { name: 'Liq. parcial', code: 'LIP' },
        { name: 'Retenida', code: 'RET' },
        { name: 'Ret. parcial', code: 'REP' },
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
          return !(this.chainSelected && this.localSelected && this.issuerSelected && this.startDate && this.endDate);
  }
        },
    methods: {
      formatAmount(amount) {
        return `${Number(amount).toFixed(config.decimalQty)}`;
       },
      async fetchChains() {
        const response = await consvenmen.fetchChains();
        this.chainOptions = response;
      },
      async fetchLocals() {
        if (this.chainSelected) {
            const response = await fetchLocals(this.chainSelected);
            this.localOptions = response.data;
        } else {
             this.localOptions = [];
        }
      },
      async fetchIssuers() {
            try {
                const response = await fetchIssuers();
                console.log("Emisores:", response);
                if (response ) {
                this.issuerOptions = response;
                } else {
                console.log("No se han recibido datos de emisor");
                }
            } catch (error) {
                console.error("Error al buscar emisores:", error);
            }
      },
      downloadExcel() {

        if (this.payments.length === 0) {
          toastr.warning('No hay registros para exportar');
          return;
        }
        const workSheet = XLSX.utils.json_to_sheet(this.payments);
        const workBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workBook, workSheet, "Payments");
        
        let titles = this.tableHeaders.map(header => header.text);
        XLSX.utils.sheet_add_aoa(workSheet, [titles], {origin: 'A1'});
        
        XLSX.writeFile(workBook, 'Payments.xlsx');
      },
      async fetchPayments() {
        if (this.chainSelected && this.localSelected && this.issuerSelected && this.startDate && this.endDate) {
          const payload = {
            idCadena: this.chainSelected,
            idLocal: this.localSelected,
            idEmisor: this.issuerSelected,
            fechaInicio: this.startDate,
            fechaFin: this.endDate,
            estadoConSelected: this.estadoConSelected,
            estadoLiqSelected: this.estadoLiqSelected,
          };

          // Convertir a objetos Date para comparar
          const startDateObj = new Date(this.startDate);
          const endDateObj = new Date(this.endDate);

          // Comprobar si la fecha inicial es mayor que la final
          if (startDateObj > endDateObj) {
            toastr.error('La fecha inicial no puede ser posterior a la fecha final.');
            return;
          }

          // Calcular la diferencia en días y verificar si supera los 31 días
          const diffTime = Math.abs(endDateObj - startDateObj);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

          if (diffDays > 31) {
            toastr.error('El rango de fechas no debe exceder los 31 días.');
            return;
          }

          const response = await fetchPayments(payload);
          this.payments = response;
          if(this.payments.length === 0) {
            toastr.warning('No se encontraron resultados.');
          }
        } else {
          toastr.error('Por favor, ingresa todos los campos obligatorios.');
        }
      },
      clearFields() {
        this.chainSelected = null;
        this.localSelected = null;
        this.issuerSelected = null;
        this.startDate = null;
        this.endDate = null;
        this.payments = [];
      },

      formatDate(dateStr) {
        if (!dateStr) return null;
        const [year, month, day] = dateStr.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        return format(date, 'dd/MM/yyyy');
      },
    },
    created() {
      this.fetchChains();
      this.fetchIssuers();
    },
  };
  </script>
  
  <style scoped>
  .button {
    height: 5.5vh !important;
  }
  .left-aligned-buttons {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
  }
  
  </style>
  