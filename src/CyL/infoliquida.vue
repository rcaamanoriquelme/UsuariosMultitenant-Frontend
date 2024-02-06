<template>
  <v-container>
    <v-toolbar flat color="white">
            <v-toolbar-title class="rdmqc">Informe de Liquidación</v-toolbar-title>
        </v-toolbar>
    <v-expansion-panels class="pb-3"> 
      <v-expansion-panel>
        <v-expansion-panel-header><i class="pe-7s-edit"> Filtros</i></v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-row >
            <v-col cols="12" md="3">
              <v-menu ref="menuStartDate" v-model="menuStartDate" :close-on-content-click="false" :nudge-right="40">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field v-model="formattedStartDate" label="Fecha Inicial" readonly v-bind="attrs" v-on="on"></v-text-field>
                </template>
                <v-date-picker v-model="startDate" @input="menuStartDate = false"></v-date-picker>
              </v-menu>
            </v-col>

            <v-col cols="12" md="3">
              <v-menu ref="menuEndDate" v-model="menuEndDate" :close-on-content-click="false" :nudge-right="40">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field v-model="formattedEndDate" label="Fecha Final" readonly v-bind="attrs" v-on="on"></v-text-field>
                </template>
                <v-date-picker v-model="endDate" @input="menuEndDate = false"></v-date-picker>
              </v-menu>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="2">
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
            </v-col>
            <v-col cols="12" md="2">
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
            </v-col>
            <v-col cols="12" md="2">
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
            </v-col>
            <v-col>
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
            <v-col cols="12" md="2">
              <v-autocomplete
              label="Bancos"
              class="font-class-name1"
              v-model="bankSelected"
              :items="bankOptions"
              item-text="ban_nombre"
              item-value="id_banco"
              clearable
              dense
              @change="fetchAccounts"
            ></v-autocomplete>
            </v-col>
            <v-col cols="12" md="2">
              <v-autocomplete
              label="Cuenta corriente"
              class="font-class-name1"
              v-model="accountSelected"
              :items="accountOptions"
              item-text="cct_numero"
              item-value="id_ctacte"
              clearable
              dense
            ></v-autocomplete>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" class="text-right my-auto">
         
              <v-btn :disabled="isSearchDisabled" class="w-15 ms-1 search-button" color="primary" @click="fetchTransactions">
                <v-icon left>pe-7s-search</v-icon>Buscar
              </v-btn>              
             
              <v-btn class="w-15 ms-2 export-button" color="success" @click="downloadExcel">
                <v-icon left>mdi-microsoft-excel</v-icon>Exportar</v-btn>
                
              <v-btn class="w-15 ms-2 export-button" color="warning" @click="clearFields">
                <i class="pe-7s-refresh-2 btn-icon-wrapper"></i>
                  Limpiar
              </v-btn>
    
            </v-col>
          </v-row>
          
               
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>

    <v-progress-linear
    v-if="loading"
    color="primary"
    indeterminate
  ></v-progress-linear>

    <v-row v-if="!flagDetalles">
      <v-col cols="12">
        <v-data-table :headers="tableHeaders" :items="transactions" class="elevation-1">
          <template v-slot:item.fecha="{ item }">
            <span
              class="fecha-link"
              @click="buscarDetalles(item.fecha)"
              style="cursor: pointer; color: #1976D2; text-decoration: underline;"
            >
              {{ item.fecha }}
            </span>
          </template>  
          <template v-slot:item.monto="{ item }">
            {{ formatAmount(item.monto) }}
          </template>
          <template v-slot:item.comision="{ item }">
            {{ formatAmount(item.comision) }}
          </template>
          <template v-slot:item.impuesto="{ item }">
            {{ formatAmount(item.impuesto) }}
          </template>
          <template v-slot:item.abono="{ item }">
            {{ formatAmount(item.abono) }}
          </template>
          <template v-slot:item.asiento="{ item }">
            {{ formatAmount(item.asiento) }}
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <v-row v-if="flagDetalles">
      <v-col cols="12">
        <v-data-table :headers="detallesTableHeaders" :items="detalleItems" class="elevation-1">
          <template v-slot:item.liq_fechapago="{ item }">
            {{ formatDate(item.liq_fechapago) }}
          </template>
          <template v-slot:item.trx_fecha="{ item }">
            {{ formatDate(item.trx_fecha) }}
          </template>
        </v-data-table>
      </v-col>
    </v-row>
</v-container>
</template>

<script>

import infoliquida from '../services/infoliquida';
import config from '../../config.js';
import { format } from 'date-fns';
import consvenmen from '../services/consvenmen';
const XLSX = require('xlsx')

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
      flagDetalles: false,
      detalleItems: [],
      startDate: null,
      endDate: null,
      chainSelected: null,
      localSelected: null,
      issuerSelected: null,
      operatorSelected: null,
      bankSelected: null,
      accountSelected: null,
      selectedTransactionDetails: [],
      chainOptions: [],
      localOptions: [],
      issuerOptions: [],
      operatorOptions: [],
      bankOptions: [],
      accountOptions: [],
      transactions: [],
      tableHeaders: [
        { text: 'Fecha', value: 'fecha' },
        { text: 'Emisor', value: 'emisor' },
        { text: 'Monto Liquidado '+config.symbolMoney, value:'montoLiquidado' },
        { text: 'Comisión Operador '+config.symbolMoney, value: 'comisionOperador' },
        { text: 'Impuestos Operador '+config.symbolMoney, value: 'impuestoOperador' },
        { text: 'Abono Operador '+config.symbolMoney, value: 'abonoOperador' },
        { text: 'Asiento '+config.symbolMoney, value: 'asiento'}
      ],

      detallesTableHeaders: [
        { text: 'Fecha', value: 'liq_fechapago' },
        { text: 'Fecha Trx', value: 'trx_fecha' },
        { text: 'Cadena', value: 'cad_nombre' },
        { text: 'Local', value: 'loc_nombre' },
        { text: 'Emisor', value: 'emi_nombre' },
        { text: 'Pedido Vtex', value: 'trx_usuario7' }, 
        { text: 'Número Asiento', value: 'liq_corr_asiento' },
        { text: 'Operador', value: 'ope_nombre' },
        { text: 'Tipo Trx', value: 'liq_tptrx' },
        { text: 'Medio de Pago', value: 'mpa_nombre' }, 
        { text: 'N° Trx', value: 'trx_idcon' },
        { text: 'Nº Tarjeta', value: 'liq_numtarjeta' },
        { text: 'Monto Trx '+config.symbolMoney, value: 'trx_monto' },
        { text: 'Disefec '+config.symbolMoney, value: 'trx_vuelto' }, 
        { text: 'Código Autorización', value: 'liq_codautor' },
        { text: 'Estado Conciliacion', value: 'ecn_estado_con' },
        { text: 'Estado Liquidacion', value: 'eli_estado_liq' }, 
        { text: 'Banco', value: 'ban_nombre' },
        { text: 'Cuenta Corriente', value: 'per_cuenta' },
        { text: 'Monto Liq '+config.symbolMoney, value: 'liq_monto' },
        { text: 'Comision Operador '+config.symbolMoney, value: 'per_comision' },
        { text: 'Impuesto Operador '+config.symbolMoney, value: 'per_impuesto' },
        { text: 'Abono Operador '+config.symbolMoney, value: 'per_neto' },
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
      return !(this.startDate && this.endDate);
    },
  },
  methods: {

    async buscarDetalles(fecha) {

      const payload = {
        fechaInicio: fecha,
        idCadena: this.chainSelected ? parseInt(this.chainSelected, 10) : undefined,
        idLocal: this.localSelected ? parseInt(this.localSelected,10) : undefined,
        idEmisor: this.issuerSelected ? this.issuerSelected : undefined,
        idOperador: this.operatorSelected ? this.operatorSelected : undefined,
        idBanco: this.bankSelected ? String(this.bankSelected) : undefined,
        idCtacte: this.accountSelected ? this.accountSelected : undefined
      };

    console.log(payload);

      const responseDetails = await infoliquida.fetchDetails(payload);
      this.detalleItems = responseDetails.data;
      this.flagDetalles = true;
      console.log(this.detalleItems);
      },
   
    formatDate(dateStr) {
      if (!dateStr) return null;
      try {
            // Crear un objeto Date asumiendo que la fecha está en la zona horaria local
            const [year, month, day] = dateStr.split('T')[0].split('-');
            const date = new Date(year, month - 1, day); // Los meses en JavaScript empiezan en 0

            return format(date, 'dd/MM/yyyy');
          } catch (error) {
            console.error('Error al formatear la fecha:', error);
            return 'Fecha inválida';
          }
      },

    formatAmount(amount) {
        return `${Number(amount).toFixed(config.decimalQty)}`;
       },

    downloadExcel() {
        
          let dataToExport = [];
          let fileName = '';
          let headers = [];

          if (this.flagDetalles) {
              // Caso de detalles
              if (this.detalleItems.length === 0) {
                  toastr.warning('No hay registros en detalles para exportar');
                  return;
              }
              dataToExport = this.detalleItems.map(item => {
                  let newItem = {};
                  this.detallesTableHeaders.forEach(header => {
                      newItem[header.text] = item[header.value];
                  });
                  return newItem;
              });
              headers = this.detallesTableHeaders;
              fileName = 'Detalles_Transacciones.xlsx';
          } else {
              // Caso de transacciones generales
              if (this.transactions.length === 0) {
                  toastr.warning('No hay registros en transacciones para exportar');
                  return;
              }
              dataToExport = this.transactions.map(item => {
                  let newItem = {};
                  this.tableHeaders.forEach(header => {
                      newItem[header.text] = item[header.value];
                  });
                  return newItem;
              });
              headers = this.tableHeaders;
              fileName = 'Transacciones.xlsx';
          }

          // Crear la hoja de Excel y descargar
          const workSheet = XLSX.utils.json_to_sheet(dataToExport);
          const workBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workBook, workSheet, "Datos");

          // Agregar títulos
          const titles = headers.map(header => header.text);
          XLSX.utils.sheet_add_aoa(workSheet, [titles], { origin: 'A1' });

          // Guardar archivo
          XLSX.writeFile(workBook, fileName);
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
    async fetchIssuers() {
        try {
          const response = await infoliquida.fetchIssuers();
          console.log(response);
          this.issuerOptions = response.map(emisor => ({
            id: emisor.id_emisor,
            value: emisor.emi_nombre,
            code: emisor.emi_codigo
          }));
        } catch (error) {
          console.error("Error al cargar emisores:", error);
        }
      },


    async fetchBanks() {
      console.log('fetchBanks');
      const response = await infoliquida.fetchBanks();
      this.bankOptions = response;
      console.log(this.bankOptions);
    },

    async getOperators() {
      if (this.issuerSelected) {
        try {
          const response = await infoliquida.fetchOperators(this.issuerSelected);
          this.operatorOptions = response.map(operador => ({
            id: operador.id_operador,
            value: operador.ope_nombre,
            code: operador.ope_codigo
          }));
        } catch (error) {
          console.error("Error al cargar operadores:", error);
        }
      } else {
        this.operatorOptions = [];
      }
    },
    async fetchAccounts() {
      console.log('fetchAccounts');
      if (this.bankSelected) {
        const response = await infoliquida.fetchAccounts(this.bankSelected);
        this.accountOptions = response;
        console.log(this.accountOptions);
      } else {
        this.accountOptions = [];
      }
    },

    async fetchTransactions() {

      console.log('fetchTransactions');

      if (!this.startDate || !this.endDate) {
        toastr.error('Por favor, selecciona ambas fechas.');
        return;
      }

      const startDateObj = new Date(this.startDate);
      const endDateObj = new Date(this.endDate);

      if (startDateObj > endDateObj) {
        toastr.error('La fecha inicial no puede ser posterior a la fecha final.');
        return;
      }

      const diffTime = Math.abs(endDateObj - startDateObj);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

      if (diffDays > 31) {
        toastr.warning('El rango de fechas no debe exceder los 31 días.');
        return;
      }

      this.loading = true;
      this.flagDetalles = false;

      // Preparar el payload para la solicitud
      let payload = {
        fechaInicio: this.startDate,
        fechaFin: this.endDate,
        incluyeRetenciones: 1,
        idMixModulo: 1,
      };

      if (this.issuerSelected != null) payload.idEmisor = this.issuerSelected;
      if (this.bankSelected != null) payload.perBanco = String(this.bankSelected);
      if (this.operatorSelected != null) payload.idOperador = this.operatorSelected;
      if (this.accountSelected != null) payload.idCtacte = this.accountSelected;
      if (this.localSelected != null) payload.idLocal = parseInt(this.localSelected);
      if (this.chainSelected != null) payload.idCadena = parseInt(this.chainSelected);

      try {

        const response = await infoliquida.fetchTransactions(payload);
        this.transactions = response.map(item => ({
          fecha: item.liq_fechapago ? this.formatDate(item.liq_fechapago) : 'N/A',
          emisor: item.emi_nombre,
          montoLiquidado: this.formatAmount(item.monto),
          comisionOperador: this.formatAmount(item.monto_comision_ope),
          impuestoOperador: this.formatAmount(item.monto_impuesto_ope),
          abonoOperador: this.formatAmount(item.abono_ope),
          asiento: this.formatAmount(item.asiento),
          retencion: this.formatAmount(item.retencion),
          retencionIVA: this.formatAmount(item.retencion_iva),
        
        }));
      } catch (error) {
        console.error("Error al cargar las transacciones:", error);
        toastr.error('Hubo un error al cargar las transacciones.');
      }

      console.log(this.transactions);

      this.loading = false;

      if (this.transactions.length == 0) {
        toastr.warning('No se encontraron registros.');
      }
 },

convertirFechaADDMYY(fecha) {
  const partes = fecha.split('/');
  // Asumiendo que fecha tiene el formato DD/MM/YYYY
  let dia = partes[0];
  let mes = partes[1];
  let año = partes[2].slice(-2); // Obtener los últimos dos dígitos del año
  return `${dia}/${mes}/${año}`;
},

clearFields() {
    this.startDate = null;
    this.endDate = null;
    this.chainSelected = null;
    this.localSelected = null;
    this.issuerSelected = null;
    this.operatorSelected = null;
    this.bankSelected = null;
    this.accountSelected = null;
    this.items = [];
    this.detalleItems = [];

   },

  changeHeader() {
   
    console.log("changeHeader")
    console.log(config.ecuador);
    //console.log(this.tableHeaders);

    if (config.ecuador == 1) {

      console.log("ecuador");
      this.tableHeaders.push(
        { text: 'Retención ' + config.symbolMoney, value: 'retencion' },
        { text: 'Retención IVA ' + config.symbolMoney, value: 'retencionIVA' }  
      );
      }
      console.log(this.tableHeaders);
  }
},
  mounted() {
    this.fetchChains();
    this.fetchIssuers();
    this.fetchBanks();
    this.changeHeader();
  },
};

</script>

<style>
.fecha-link {
  cursor: pointer;
  color: #1976D2; /* or your theme's primary color */
  text-decoration: underline;
}
</style>


