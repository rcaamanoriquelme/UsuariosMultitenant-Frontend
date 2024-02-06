<template>
    <div>
      <v-toolbar flat color="white">
            <v-toolbar-title class="rdmqc">Reporte Monitorero de Archivos</v-toolbar-title>
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
            v-model="cadena"
            :items="chainOptions"
            item-text="value"
            return-object
            clearable
            dense
            @change="fetchEmitters"
          ></v-autocomplete>
        </v-col>
  
        <v-col cols="12" md="3" class="pa-2">
          <v-autocomplete
            label="Emisor"
            v-model="emisor"
            :items="emitterOptions"
            item-text="value"
            return-object
            clearable
            dense
            @change="fetchOperators"
          ></v-autocomplete>
        </v-col>
  
        <v-col cols="12" md="3" class="pa-2">
          <v-autocomplete
            label="Operador"
            v-model="operador"
            :items="operatorOptions"
            item-text="value"
            return-object
            clearable
            dense
          ></v-autocomplete>
        </v-col>
      </v-row>
  
      <v-row class="pa-6 justify-end">
        <v-btn :disabled="isSearchDisabled" class="w-15 ms-1 search-button" color="primary" @click="fetchTransactions">
          <v-icon left>pe-7s-search</v-icon>Buscar
        </v-btn>        
        <v-btn class="w-15 ms-2 export-button" color="success" @click="exportToExcel"><v-icon left>mdi-microsoft-excel</v-icon>Exportar</v-btn>
      </v-row>
    </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
  
  <v-data-table :headers="tableHeaders" :items="transactions" class="elevation-1">
      </v-data-table>
    </div>
</template>

<script>
import api from '../services/monrepmoar';
import consvenmen from '../services/consvenmen';
import * as XLSX from 'xlsx';
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
      menuStart: false,
      menuEnd: false,
      startDate: null,
      endDate: null,
      cadena: null,
      emisor: null,
      operador: null,
      chainOptions: [],
      emitterOptions: [],
      operatorOptions: [],
      transactions: [],
      tableHeaders: [
        { text: 'Cadena', value: 'cad_nombre' },
        { text: 'Fecha Trx', value: 'are_fecha' },
        { text: 'Llegada Ruta BBR', value: 'are_llegada_ruta' },
        { text: 'Procesado por BBR', value: 'are_procesado' },
        { text: 'Nombre de Archivo', value: 'are_nombre_archivo' },
        { text: 'Interfaz Generado', value: 'are_interfaz_generado' },
        { text: 'Emisor', value: 'emi_nombre' },
        { text: 'Operador', value: 'ope_nombre' },
        { text: 'Observación', value: 'are_observacion' },
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
     } 
  },
  methods: {
    getIdFromObject(obj) {
        return obj ? obj.id : null;
      },
      
    formatDate(dateStr) {
      if (!dateStr) return null;
      const [year, month, day] = dateStr.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      return format(date, 'dd/MM/yyyy');
      },

    exportToExcel() {
      if (this.transactions.length === 0) {
        toastr.warning('No hay registros para exportar');
        return;
       }

       try {
                if (this.transactions.length > 0) {
                    let data = this.transactions.map(row => ({
                    'Cadena': row.cad_nombre,
                    'Fecha Trx': row.fecha_csv,
                    'Hora Trx': row.hora_csv,
                    'LLegada Ruta BBR': row.are_llegada_ruta,
                    'Procesado por BBR': row.are_procesado,
                    'Nombre Archivo': row.are_nombre_archivo,
                    'Interfaz Generado': row.are_interfaz_generado,
                    'Emisor': row.emi_nombre,
                    'Operador': row.ope_nombre,
                    'Observacion': row.are_observacion
                    }));
                    const ws = XLSX.utils.json_to_sheet(data);
                    const wb = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(wb, ws, "Transactions");
                    XLSX.writeFile(wb, "Transactions.xlsx");
                    toastr.success("Se generó la planilla con éxito.");
                } else {
                  toastr.warning("No hay registros para exportar.");
                }
                
            } catch (error) {
                console.log(error);
                toastr.error("Hubo un error al generar planilla.");
            }
      },

    async fetchChains() {
      const response = await consvenmen.fetchChains();
      this.chainOptions = response;
      console.log('fetchChains:', this.chainOptions);
    },
    async fetchEmitters() {
      if (this.cadena) {
        const response = await consvenmen.fetchEmitters(this.cadena.id);
        this.emitterOptions = response.data;
        console.log('fetchEmitters:', this.emitterOptions);
      }
    },
    async fetchOperators() {
      if (this.emisor) {
        const response = await consvenmen.fetchOperators(this.emisor.id);
        this.operatorOptions = response.data;
        console.log('fetchOperators:', this.operatorOptions);
      }
    },
    async fetchTransactions() {

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
          fechaInicio: this.startDate,
          fechaFinal: this.endDate,
          idCadena: this.getIdFromObject(this.cadena),
          idEmisor: this.getIdFromObject(this.emisor),
          idOperador: this.getIdFromObject(this.operador),
        };

        try {
          const response = await api.fetchInfo(payload); 

          if(response.data.length === 0) {
            toastr.warning('No se encontraron resultados');
          }
          this.transactions = response.data.map(transaction => ({
            ...transaction,
            fecha_csv: format(new Date(transaction.are_fecha), 'dd-MM-yyyy'),
            hora_csv: format(new Date(transaction.are_fecha), 'HH:mm:ss'),
            are_fecha: format(new Date(transaction.are_fecha), 'dd/MM/yyyy HH:mm:ss'),
            are_llegada_ruta: transaction.are_llegada_ruta === 'Y' ? 'Si' : 'No',
            are_procesado: transaction.are_procesado === 'Y' ? 'Si' : 'No'
          }));
          console.log('fetchTransactions:', this.transactions);
        } catch (error) {
          console.error('Error en fetchTransactions:', error);
        }
    },

    clearFields() {
      this.startDate = null;
      this.endDate = null;
      this.cadena = null;
      this.emisor = null;
      this.operador = null;
      this.transactions = [];
      this.fetchChains();
    },

  },

  created() {
    this.fetchChains();
  },
};


</script>

<style scoped>
.button {
  width: 130px;
}
.large-button {
    width: 200px;
    height: 60px;
    font-size: 16px;
    margin-right: 16px; /* Añade un margen a la derecha del botón */
  }
</style>
