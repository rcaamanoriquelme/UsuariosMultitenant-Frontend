<template>
    <div>
      <v-toolbar flat color="white">
            <v-toolbar-title class="rdmqc">Transacciones Pago con Error</v-toolbar-title>
      </v-toolbar>
      <v-expansion-panels class="pb-3">
      <v-expansion-panel>     
        <v-expansion-panel-header><i class="pe-7s-edit"> Filtros</i></v-expansion-panel-header>
        <v-expansion-panel-content>
      <v-row>
        <v-col cols="12" md="6" class="pa-2">
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
  
        <v-col cols="12" md="6" class="pa-2">
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
      </v-row>
      <v-row class="pa-6 justify-end">
          <v-row class="pa-6 justify-end">
            <v-btn :disabled="isSearchDisabled" class="w-15 ms-1 search-button" color="primary" @click="fetchPaymentServiceErrors">
              <v-icon left>pe-7s-search</v-icon> Buscar
            </v-btn>          
            <v-btn class="w-15 ms-2 export-button" color="success" @click="downloadExcel"><v-icon left>mdi-microsoft-excel</v-icon>Exportar</v-btn> 
          </v-row>
      </v-row>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
  
  <div>
    <v-data-table :headers="paymentServiceErrorHeaders" :items="paymentServiceErrors" class="elevation-1">
      <template v-slot:item.page_t_fecha="{ item }">
        {{ formatDate(item.page_t_fecha) }}
      </template>
      <template v-slot:item.etrxe_nombre="{ item }">
        {{ item.etrxe_nombre }}
      </template>
      <template v-slot:item.action="{ item }">
        <v-btn color="red" @click="openErrorDetailDialog(item.id_page)">Detalles</v-btn>
      </template>
    </v-data-table>
  </div>
  
    <v-dialog v-model="errorDetailDialog" max-width="800px">
        <v-card>
          <v-card-title>Detalles del Error</v-card-title>
          <v-card-text>
            <v-simple-table dense>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">Clave</th>
                    <th class="text-left">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(value, name) in errorDetail" :key="name">
                    <td>{{ name }}</td>
                    <td>{{ value }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="errorDetailDialog = false">Cerrar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </template>
  
  
  <script>
  import PaymentServiceErrorService from '@/services/montraemps';
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
        menuStart: false,
        menuEnd: false,
        dialog: false,
        paymentServiceErrors: [],
        startDate: null, 
        endDate: null,
        errorDetail: {},
        errorDetailDialog: false,  
        paymentServiceErrorHeaders: [
          { text: 'Fecha', value: 'page_t_fecha', sortable: false },
          { text: 'Motivo de Error', value: 'etrxe_nombre' },
          { text: 'Acciones', value: 'action', sortable: false },
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
          return !(this.startDate && this.endDate); // El botón se desactiva si alguna de las fechas NO está seleccionada
  }
      },
    methods: {
      async fetchPaymentServiceErrors() {
    
        if (this.startDate > this.endDate) {
          toastr.error('La fecha inicial debe ser menor a la fecha final');
          return;
        }

          // Verifica si el rango de fechas es demasiado grande
        const diffTime = Math.abs(new Date(this.endDate) - new Date(this.startDate));
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays > 31) {
          toastr.warning('El rango de fechas no debe ser mayor a 31 días.');
          return;
        }

        const response = await PaymentServiceErrorService.fetchPaymentServiceErrors({
          fechaInicio: this.startDate,
          fechaFinal: this.endDate,
        });
        
        this.paymentServiceErrors = response.data;
        
        if (this.paymentServiceErrors.length === 0) {
          toastr.warning('No se encontraron resultados');
        }
      },
      async openErrorDetailDialog(id_page) {
        const errorDetail = await PaymentServiceErrorService.fetchErrorDetail(id_page);
        this.errorDetail = errorDetail;
        this.errorDetailDialog = true;
      },

      downloadExcel() {
          
        if (this.paymentServiceErrors.length === 0) {
            toastr.warning('No hay registros para exportar');
            return;
          }
         
          const workSheet = XLSX.utils.json_to_sheet(this.paymentServiceErrors);
          const workBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workBook, workSheet, "Transactions");
          
          // Define los títulos de las columnas
          let titles = this.paymentServiceErrorHeaders.map(header => header.text);
          XLSX.utils.sheet_add_aoa(workSheet, [titles], {origin: 'A1'});
          
          // Descargar el archivo
          XLSX.writeFile(workBook, 'Transactions.xlsx');
      },
      formatDate(dateStr) {
      if (!dateStr) return null;
        const [year, month, day] = dateStr.split('-').map(Number);
        const date = new Date(year, month - 1, day); 
        return format(date, 'dd/MM/yyyy');
      },
    },
  };
  </script>
  