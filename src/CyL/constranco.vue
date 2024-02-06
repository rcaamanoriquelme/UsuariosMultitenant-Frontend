<template>
  <div>
    <v-overlay :value="loadingTransactions">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </v-overlay>
    <v-expansion-panels class="pb-3">
      <v-toolbar flat color="white">
        <v-toolbar-title class="rdmqc">Consulta de Transacciones</v-toolbar-title>
      </v-toolbar>
      <v-expansion-panel>   
          <v-expansion-panel-header><i class="pe-7s-edit"> Filtros</i></v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-row>
            <v-col cols="12" sm="3">
              <v-row class="pa-6">
                <v-menu v-model="menuStart" :close-on-content-click="false">
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="computedDateFormatted1"
                      label="Fecha inicial"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      class="font-class-name"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="startDate"  @change="menuStart = false"></v-date-picker>
                </v-menu>

                <v-menu v-model="menuEnd" :close-on-content-click="false">
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="computedDateFormatted2"
                      label="Fecha final"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      class="font-class-name"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="endDate" @change="menuEnd = false"></v-date-picker>
                </v-menu>
              </v-row>
            </v-col>

            <v-col cols="12" sm="3">
              <v-row class="pa-6">
                <v-autocomplete
                  label="Cadena"
                  class="font-class-name1"
                  v-model="chainSelected"
                  :items="chainOptions"
                  @change="getLocales"
                  item-text="value"
                  item-value="value"
                  clearable
                  dense
                ></v-autocomplete>
              </v-row>
            </v-col>

            <v-col cols="12" sm="3">
              <v-row class="pa-6">
                <v-autocomplete
                  label="Local"
                  class="font-class-name1"
                  v-model="localSelected"
                  :items="localOptions"
                  item-text="value"
                  item-value="value"
                  clearable
                  dense
                ></v-autocomplete>
              </v-row>
            </v-col>

            <v-col cols="12" sm="3">
              <v-row class="pa-6">
                <v-autocomplete
                  label="Emisor"
                  class="font-class-name1"
                  v-model="issuerSelected"
                  :items="issuerOptions"
                  item-text="value"
                  item-value="value"
                  clearable
                  dense
                ></v-autocomplete>

                <v-autocomplete
                  label="Tipo"
                  class="font-class-name1"
                  v-model="typeSelected"
                  :items="typeOptions"
                  item-text="value"
                  item-value="value"
                  clearable
                  dense
                ></v-autocomplete>

                <v-autocomplete
                  label="Estado"
                  class="font-class-name1"
                  v-model="statusSelected"
                  :items="statusOptions"
                  item-text="value"
                  item-value="value"
                  clearable
                  dense
                ></v-autocomplete>
              </v-row>
            </v-col>
          </v-row>
          
          <v-row>
            <v-col cols="12" class="text-right my-auto">
              <v-spacer></v-spacer>
              <v-btn class="w-15 ms-1 search-button" color="primary" @click="fetchTransactions" :disabled="!isDateRangeSelected">
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
      <template v-slot:item.vuelto="{ item }">
        {{ formatAmount(item.vuelto) }}
      </template>
    </v-data-table>
  </div>
</template>


<script>
  import { getCadenas, getEmisores, getTipos, getEstados, getLocales, getTransacciones } from '../services/constranco';
  import config from '../../config.js';
  import moment from 'moment';
  import toastr from 'toastr';
  import 'toastr/build/toastr.min.css';
  const XLSX = require('xlsx');

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
        chainOptions: [],
        chainSelected: '',
        localOptions: [],
        localSelected: '',
        issuerOptions: [],
        issuerSelected: '',
        typeOptions: [],
        typeSelected: '',
        statusOptions: [],
        statusSelected: '',
        startDate: null,
        endDate: null,
        menuStart: false,
        menuEnd: false,
        loadingTransactions: false,
        transactions: [],
        tableHeaders: [
        { text: 'Fecha', value: 'date' },
        { text: 'Cadena', value: 'chain' },
        { text: 'Local', value: 'local' },
        { text: 'Emisor', value: 'issuer' },
        { text: 'Pos', value: 'pos' },
        { text: 'Tipo Trx', value: 'trxType' },
        { text: 'Tarjeta', value: 'tarNombre' },
        { text: 'N° Trx', value: 'transactionNumber' },
        { text: 'Monto '+config.symbolMoney, value: 'amount' },
        { text: 'Estado', value: 'status' },
        { text: 'Cod.Autor', value: 'codAutor' },
        { text: 'N° Tarjeta/Vale', value: 'card' },
        { text: 'Disefec. '+config.symbolMoney, value: 'vuelto' },
        { text: 'Cambio de Pago', value: 'cambioPago' },
    
      ],
      };
    },
    computed: {
      isDateRangeSelected() {
        return this.startDate && this.endDate
      },
      computedDateFormatted1() {
              return this.formatDate1(this.startDate);
        },
      computedDateFormatted2() {
              return this.formatDate1(this.endDate);
          }
    },
    async mounted() {
      const chainResponse = await getCadenas();
      this.chainOptions = chainResponse;
      const issuerResponse = await getEmisores();
      this.issuerOptions = issuerResponse;
      const typeResponse = await getTipos();
      this.typeOptions = typeResponse;
      const statusResponse = await getEstados();
      this.statusOptions = statusResponse;
    },
    methods: {
         
      formatAmount(amount) {
        return `${Number(amount).toFixed(config.decimalQty)}`;
       },

        formatDate1(date) {
            if (!date) return null;
            const [year, month, day] = date.split("-");
            return `${day}/${month}/${year}`;
        },
        async getLocales() {
          const response = await getLocales(this.chainSelected);
          this.localOptions = response;
        },

        transformTransactions(transactions) {
            return transactions.map(transaction => {
              return {
                ...transaction,
                date: transaction.date ? moment(transaction.date).format('DD/MM/YYYY') : 'N/A',
                chain: transaction.chain || '0',
                local: transaction.local || '0',
                issuer: transaction.issuer || '0',
                pos: transaction.pos || 'No',
                trxType: transaction.trxType || '0',
                tarNombre: transaction.tarNombre || 'N/A',
                card: transaction.card || '0',
                transactionNumber: transaction.transactionNumber ? transaction.transactionNumber.toString() : '0',
                amount: (transaction.amount != null && !isNaN(transaction.amount)) ? parseFloat(transaction.amount).toFixed(2) : '0.00',
                status: transaction.status || '0',
                codAutor: transaction.codAutor || '0',
                vuelto: (transaction.vuelto != null && !isNaN(transaction.vuelto)) ? parseFloat(transaction.vuelto).toFixed(2) : '0.00',
                cambioPago: transaction.cambioPago || 'N/A',
              };
            });
        },
        
        async fetchTransactions() {
          if (this.startDate && this.endDate) {
              
            if (new Date(this.endDate) < new Date(this.startDate)) {
              toastr.error('La fecha final debe ser mayor o igual a la fecha inicial');
              return;
            }

            const diffTime = Math.abs(new Date(this.endDate) - new Date(this.startDate));
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays > 31) {
              toastr.error('El rango de fechas no debe ser mayor a 31 días');
              return;
            }

            this.loadingTransactions = true;

            try {
              const response =  await getTransacciones({
              startDate: this.startDate,
              endDate: this.endDate,
              chain: this.chainSelected || null,
              local: this.localSelected || null,
              issuer: this.issuerSelected || null,
              trxType: this.typeSelected || null,
              status: this.statusSelected || null,
            });
              this.transactions = this.transformTransactions(response.data);
              console.log('Transactions:', this.transactions);

              this.loadingTransactions = false;

              if(this.transactions.length === 0) {
                toastr.warning('No se encontraron resultados');
                this.transactions = [];
              }
            } catch (error) {
              console.error(error);
            }
          }
      },

      formatDateForPayload(dateString) {
         return dateString
        },

        downloadExcel() {
          if (this.transactions.length === 0) {
              toastr.warning('No hay registros para exportar');
              return;
          }

          let data = this.transactions.map(row => ({
            'Fecha': row.date,
            'Cadena': row.chain,
            'Local': row.local,
            'Emisor': row.issuer,
            'Pos': row.pos,
            'Tipo Trx': row.trxType,
            'Tarjeta': row.tarNombre, 
            'N° Trx': row.transactionNumber,
            'Monto': row.amount,
            'Estado': row.status,
            'Cod.Autor': row.codAutor,
            'N° Tarjeta/Vale': row.card,
            'Disefec.': row.vuelto,
            'Cambio de Pago': row.cambioPago 
           
          }));

          const ws = XLSX.utils.json_to_sheet(data);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Transacciones');
          XLSX.writeFile(wb, 'Transacciones.xlsx');
        },


      clearFields() {
        this.chainSelected = '';
        this.localSelected = '';
        this.issuerSelected = '';
        this.typeSelected = '';
        this.statusSelected = '';
        this.startDate = null;
        this.endDate = null;
        this.localOptions = [];
        this.transactions = [];
      },
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
</style>
