<template>
  <div>
  <v-toolbar flat color="white">
            <v-toolbar-title class="rdmqc">Informe Vales</v-toolbar-title>
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
        <v-autocomplete
          label="Comercio"
          class="font-class-name1"
          v-model="comercioSelected"
          :items="comercioOptions"
          item-text="com_nombre"
          item-value="id_comercio"
          clearable
          dense
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
      </v-col>
    </v-row>
    <v-row class="pa-6 justify-end">
      <v-btn :disabled="isSearchDisabled" class="w-15 ms-1 search-button" color="primary" @click="fetchVales">
        <v-icon left>pe-7s-search</v-icon> Buscar
      </v-btn>      
      <v-btn :disabled="isSearchDisabled" class="w-15 ms-2 export-button" color="success" @click="downloadSummaryExcel"> <v-icon left>mdi-microsoft-excel</v-icon>Resumen</v-btn>
      <v-btn :disabled="isSearchDisabled" class="w-15 ms-2 export-button" color="success" @click="downloadDetailExcel"> <v-icon left>mdi-microsoft-excel</v-icon>Detalle</v-btn>
      <v-btn class="w-15 ms-2 export-button" color="warning" @click="clearFields">
        <i class="pe-7s-refresh-2 btn-icon-wrapper"></i>
          Limpiar
      </v-btn>
    </v-row>
    </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
  <br>
  <v-progress-linear
      v-if="loading"
      color="primary"
      indeterminate
    ></v-progress-linear>
  <v-data-table :headers="tableHeaders" :items="vales" class="elevation-1">
  </v-data-table>
  <div class="totals">
    <span>Total Cantidad: {{ totalCantidad }}</span>
    <span>Total: {{ totalTotales }}</span>
  </div>
  </div>
</template>

<script>

import * as XLSX from 'xlsx';
import consvenmen from '../services/consvenmen';
import infoVales from '../services/infovales';
import config from '../../config.js';
import { format } from 'date-fns';
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
      comercioOptions: [],
      comercioSelected: null,
      chainOptions: [],
      localOptions: [],
      vales: [],
      tableHeaders: [
        { text: 'Empresa', value: 'empresa' },
        { text: 'Local', value: 'local' },
        { text: 'Denominación', value: 'denominacion' },
        { text: 'Cantidad', value: 'cantidad' },
        { text: 'Total '+config.symbolMoney, value: 'total' },
      ],
    };
  },
  watch: {
    chainSelected: 'getLocales',
  },
  computed: {
    formattedStartDate() {
        return this.startDate ? this.formatDate(this.startDate) : null;
      },
    formattedEndDate() {
        return this.endDate ? this.formatDate(this.endDate) : null;
      },
    isSearchDisabled() {
      return !(this.startDate && this.endDate && this.comercioSelected); 
    },
    totalCantidad() {
      let total = 0;
      this.vales.forEach(vale => {
          total += Number(vale.cantidad);
      });
      return total.toFixed(2); // Formatea a dos decimales
      },
    totalTotales() {
      let total = 0;
      this.vales.forEach(vale => {
          total += Number(vale.total);
      });
      return (config.symbolMoney+" "+total.toFixed(2)); // Formatea a dos decimales
    },

  },
  methods: {
    formatDate(dateStr) {
      if (!dateStr) return null;
      const [year, month, day] = dateStr.split('-').map(Number);
      const date = new Date(year, month - 1, day); 
      return format(date, 'dd/MM/yyyy');
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
    async fechComercio() {
      const response = await infoVales.fetchComercio();
      this.comercioOptions = response.data;
      console.log(this.comercioOptions);
    },
    async fetchVales() {
      if(!this.startDate || !this.endDate) {
        toastr.error('Por favor, seleccione las fechas inicial y final.');
        return;
        }

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

      this.loading = true;

      const payload = {
        fechaInicial: this.startDate,
        fechaFinal: this.endDate,
        cadena: this.chainSelected,
        local: this.localSelected,
        comercio: this.comercioSelected,
      };

      try {
        const response = await infoVales.fetchVales(payload);
        this.vales = response.data;
    
        const selectedComercioOption = this.comercioOptions.find(c => c.id_comercio=== this.comercioSelected);
        const comercioName = selectedComercioOption ? selectedComercioOption.com_nombre : 'Not selected';

        // Add the selected commerce name to each vale object
        this.vales = this.vales.map(vale => ({
          ...vale,
          empresa: comercioName
        }));

        if (this.vales.length === 0) {
          toastr.warning('No se encontraron resultados');
        }

        this.loading = false;
        
      } catch (error) {
        console.error(error);
        this.loading = false;
      }
    },
    clearFields() {
      this.menuStart = false;
      this.menuEnd = false;
      this.startDate = null;
      this.endDate = null;
      this.chainSelected = null;
      this.localSelected = null;
      this.comercioSelected = null;
      this.vales = [];
    },
    async downloadSummaryExcel() {

    const payload = {
      fechaInicial: this.startDate,
      fechaFinal: this.endDate,
      cadena: this.chainSelected,
      local: this.localSelected,
      comercio: this.comercioSelected,
    };

    try {
            const response = await infoVales.fetchVales2(payload);
            let summaryData = response.data;

            console.log(summaryData.length);

            this.loading = true;

            // Manually specify the headers based on your image and data structure
            const headers = [
              'Cadena', 'Local', 'Denominación', 'Cantidad', 'Total', 
              'Codigo Vale', 'Centro Benef', 'Empresa'
            ];

              
            const selectedComercioOption = this.comercioOptions.find(c => c.id_comercio=== this.comercioSelected);
            const comercioName = selectedComercioOption ? selectedComercioOption.com_nombre : 'Not selected';
            // Map the data to ensure the order of columns matches your headers
            summaryData = summaryData.map(item => ({
              'Cadena': item['0'],       // Map '0' to 'Cadena'
              'Local': item['1'],        // Map '1' to 'Local'
              'Denominación': item['2'], // Map '2' to 'Denominación'
              'Cantidad': item['3'],     // Map '3' to 'Cantidad'
              'Total': item['4'],        // Map '4' to 'Total'
              'Codigo Vale': item['5'],  // Map '5' to 'Codigo Vale'
              'Centro Benef': item['7'], // Map '7' to 'Centro Benef'
              'Empresa': comercioName // Add the selected commerce name
            }));

            let totalCantidad = 0;
            summaryData.forEach(item => {
                const cantidad = Number(item['Cantidad']); 
                totalCantidad += isNaN(cantidad) ? 0 : cantidad;
            });
            totalCantidad = totalCantidad.toFixed(2);

            let totalTotal = 0;
            summaryData.forEach(item => {
                const total = Number(item['Total']); 
                totalTotal += isNaN(total) ? 0 : total;
            });
            totalTotal = totalTotal.toFixed(2);

            summaryData.push({
              'Cadena': '',
              'Local': '',
              'Denominación': 'Totales',
              'Cantidad': totalCantidad,
              'Total': totalTotal,
              'Codigo Vale': '',
              'Tarjeta': '',
              'Centro Benef': '',
              'Empresa': ''
            });


            // Convert headers to a 2D array for aoa_to_sheet
            const headerRow = [headers];

            // Create a worksheet with headers
            const ws = XLSX.utils.aoa_to_sheet(headerRow);

            // Add summaryData starting from the second row
            XLSX.utils.sheet_add_json(ws, summaryData, { skipHeader: true, origin: 'A2' });

            // Create workbook and append worksheet
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Resumen');

            // Write workbook to file
            XLSX.writeFile(wb, 'resumen_vales.xlsx');

            this.loading = false;
            } catch (error) {
            console.error('There was an error fetching the summary data:', error);
            toastr.error('Error al obtener los datos para el resumen.');
            this.loading = false;
        }
    },

    async downloadDetailExcel() {
        const payload = {
          fechaInicial: this.startDate,
          fechaFinal: this.endDate,
          cadena: this.chainSelected,
          local: this.localSelected,
          comercio: this.comercioSelected, 
        };

        try {
          this.loading = true;
          const response = await infoVales.fetchVales3(payload); 
          let detailData = response.data;

          const selectedComercioOption = this.comercioOptions.find(c => c.id_comercio === this.comercioSelected);
          const comercioName = selectedComercioOption ? selectedComercioOption.com_nombre : 'Not selected';

          // Define the headers for your detail Excel file
          const headers = [
            'Fecha', 'Cadena', 'Local', 'Centro Benef', 'Codigo Vale', 'Empresa', 
            'Nro Vale', 'Caja', 'Nro Trx', 'Total S/.'
          ];

          // Map the data to match the headers for the Excel file
          detailData = detailData.map(item => ({
            'Fecha': item.fecha, // format the date as needed
            'Cadena': item.cadena,
            'Local': item.loc_nombre,
            'Centro Benef': item.csap,
            'Codigo Vale': item.codigo_vale,
            'Empresa': comercioName,
            'Nro Vale': item.numtarjeta,
            'Caja': item.pos,
            'Nro Trx': item.num_trx,
            'Total': item.total
          }));

          let totalTotal = 0;
          detailData.forEach(item => {
            const total = Number(item['Total']); 
            totalTotal += isNaN(total) ? 0 : total;
          });
          totalTotal = totalTotal.toFixed(2);

          detailData.push({
            'Fecha': '',
            'Cadena': '',
            'Local': '',
            'Centro Benef': '',
            'Codigo Vale': '',
            'Empresa': 'Totales',
            'Nro Vale': '',
            'Caja': '',
            'Nro Trx': '',
            'Total': totalTotal
          });

          // Convert headers to a 2D array for aoa_to_sheet
          const headerRow = [headers];

          // Create a worksheet with headers
          const ws = XLSX.utils.aoa_to_sheet(headerRow);

          // Add detailData starting from the second row
          XLSX.utils.sheet_add_json(ws, detailData, { skipHeader: true, origin: 'A2' });

          // Create workbook and append worksheet
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Detalle');
          XLSX.writeFile(wb, 'detalle_vales.xlsx');

          this.loading = false;
        } catch (error) {
          console.error('There was an error fetching the detail data:', error);
          toastr.error('Error al obtener los datos para el detalle.');
          this.loading = false;
        }
      }

  }
  ,
  created() {
    this.fetchChains();
    this.fechComercio();
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
.totals {
  margin-top: 20px;
  font-size: 1.2rem;
  display: flex;
  justify-content: flex-end; 
  gap: 20px; 
}


</style>
