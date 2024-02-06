<template>
  <div>

    <!-- DIALOG DE DETALLE SALDO VIGENTE -->
    <v-dialog v-model="dialogDetalleSaldoVigente" scrollable>
        <!-- CONFIGURACIÓN TABLA DETALLE SALDO VIGENTE-->
        <v-data-table 
        v-model="selectedDetalleSaldoVigente"
        :headers="tableHeadersDetalleSaldoVigente"
        :items="dessertsDetalleSaldoVigente"
        :loading="loadTableDetalleSaldoVigente"
        loading-text="Cargando Registros..."
        class="elevation-1"
        :height="'400px'"
        :fixed-header="true"
        :footer-props="{
        'items-per-page-text':'Registros por página',
        'pageText': '{0}-{1} de {2}'
        }"
        >
        <template v-slot:top>
            <v-toolbar flat color="white">
                <v-toolbar-title class="rdmqc">Detalle de saldo vigente</v-toolbar-title>
            </v-toolbar>
        </template>
        <template v-slot:no-data>
            <span>No hay registros</span>
        </template>
        </v-data-table>
    </v-dialog>

    <!-- TÍTULO PANTALLA -->
    <v-toolbar flat color="white">
        <v-toolbar-title class="rdmqc">Informe saldo vigente</v-toolbar-title>
        </v-toolbar>
    <v-expansion-panels class="pb-3">
      <v-expansion-panel>
        <v-expansion-panel-header><i class="pe-7s-edit"> Filtros</i></v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-row>
            <v-col cols="6">
              <v-row align-start class="pa-6">
                <v-menu v-model="menuStart" :close-on-content-click="false">
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      :value="formattedStartDate"
                      label="Fecha corte"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="startDate" @input="menuStart = false"></v-date-picker>
                </v-menu>
              </v-row>

              <v-row align-start class="pa-6">
                <v-autocomplete
                  label="Cadena"
                  class="font-class-name1"
                  v-model="chainSelected"
                  :items="chainOptions"
                  item-text="value"
                  item-value="id"
                  clearable
                  dense
                  @change="getLocalesByCadena"
                ></v-autocomplete>
              </v-row>
            </v-col>

            <v-col cols="6">
              <v-row align-start class="pa-6">
                <v-autocomplete
                  label="Local"
                  class="font-class-name1"
                  v-model="localSelected"
                  :items="localOptions"
                  item-text="loc_nombre"
                  item-value="id_local"
                  clearable
                  dense
                ></v-autocomplete>
              </v-row>

              <v-row align-start class="pa-6">
                <v-autocomplete
                  label="Emisor"
                  class="font-class-name1"
                  v-model="issuerSelected"
                  :items="issuerOptions"
                  item-text="emiNombre"
                  item-value="idEmisor"
                  clearable
                  @input="getOperatorsByEmisor"
                  dense
                ></v-autocomplete>
              </v-row>

              <v-row align-start class="pa-6">
                <v-autocomplete
                  label="Operador"
                  class="font-class-name1"
                  v-model="operatorSelected"
                  :items="operatorOptions"
                  item-text="opeNombre"
                  item-value="idOperador"
                  clearable
                  dense
                ></v-autocomplete>
              </v-row>
            </v-col>

            <v-col cols="12">
              <v-row align-start class="pa-6 justify-end"> 
                <v-btn :disabled="isSearchDisabled" class="w-15 ms-1" color="primary" @click="fetchTransactions">
                  <v-icon left>pe-7s-search</v-icon> 
                  Buscar
                </v-btn>                             
                <v-btn class="w-15 ms-2" color="success" @click="downloadExcel">
                  <v-icon left>mdi-microsoft-excel</v-icon> 
                  Exportar
                </v-btn>

              </v-row>
            </v-col>
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>

    <v-data-table :headers="tableHeaders" :items="transactions" class="elevation-1">
      <template v-slot:[`item.date`]="{ item }">
        {{ formatDate(item.date) }}
      </template>
      <template v-slot:[`item.saldo`]="{ item }">
        <span class="fake-link" @click="showDialogDetalleSalgoVigente(item)">
          {{ formatAmount(item.saldo) }}
        </span>
      </template>
    </v-data-table>
  </div>
</template>



<script>
const XLSX = require('xlsx');
import { getCadenas, getSaldos, getDetalleSaldos, getLocalesByCadena, getEmisores, getOperadoresByEmisor, } from '../services/infosalvige';
import config from '../../config.js';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';

// Configuración opcional
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
      menuStart: false,
      menuEnd: false,
      startDate: null,
      endDate: null,
      chainSelected: null,
      localSelected: null,
      issuerSelected: null,
      operatorSelected: null,
      chainOptions: [],
      localOptions: [],
      issuerOptions: [],
      operatorOptions: [],
      transactions: [],
      tableHeaders: [
        { text: 'Cadena', value: 'cadena' },
        { text: 'Local', value: 'local' },
        { text: 'Emisor', value: 'emisor' },
        { text: 'Operador', value: 'operador' },
        { text: 'Saldo '+config.symbolMoney, value: 'saldo' },
      ],

      //MODAL DETALLE SALDO VIGENTE
      dialogDetalleSaldoVigente: false,
      selectedDetalleSaldoVigente: [],
      tableHeadersDetalleSaldoVigente: [
        { text: 'Fecha Trx', value: 'trx_fecha'},
        { text: 'Cadena', value: 'cad_nombre'},
        { text: 'Local', value: 'loc_nombre'},
        { text: 'Emisor', value: 'emi_nombre'},
        { text: 'Operador', value: 'ope_nombre'},
        { text: 'Tipo Trx', value: 'tte_nombre'},
        { text: 'Medio Pago', value: 'tar_nombre'},
        { text: 'N° Trx', value: 'trx_boleta'},
        { text: 'N° Tarjeta', value: 'trx_numtarjeta'},
        { text: 'Saldo S/.', value: 'trx_saldo'}
      ],
      dessertsDetalleSaldoVigente: [],
      loadTableDetalleSaldoVigente: false

    };
  },
  computed: {
    formattedStartDate() {
        if (!this.startDate) return null;
        const [year, month, day] = this.startDate.split('-');
        return `${day}/${month}/${year}`;
    },
      isSearchDisabled() {
        return !this.startDate; 
    }
  },
  methods: {
    
    formatAmount(amount) {
        return `${Number(amount).toFixed(config.decimalQty)}`;
       },

    async getLocalesByCadena() {
      this.localOptions = [];
        try {
            const response = await getLocalesByCadena(this.chainSelected);
            this.localOptions = response|| [];
        } catch (error) {
            console.error('Error fetching locales:', error);
        }
    },

    async getOperatorsByEmisor() {
      this.operatorOptions = [];
        try {
          
          const response = await getOperadoresByEmisor(this.issuerSelected);
          this.operatorOptions = response|| [];
            /* this.operatorOptions = response.data.map(operator => ({
                value: operator.value,
                id: operator.id,
            })); */
        } catch (error) {
            console.error('Error fetching operators:', error);
        }
    },

    async fetchTransactions() {

      // AÑADIR VALIDACIONE
      if (!this.chainSelected) {
        toastr.warning('Debe seleccionar una cadena.');
      }

      if (!this.localSelected) {
        toastr.warning('Debe seleccionar un local.');
      }

      if (!this.issuerSelected) {
        toastr.warning('Debe seleccionar un emisor.');
      }

      if (!this.operatorSelected) {
        toastr.warning('Debe seleccionar un operador.');
      }

      if (this.chainSelected && this.localSelected && this.issuerSelected && this.operatorSelected) {
        
        try {        
            const payload = {
                fecha: this.startDate,
                cadena: this.chainSelected,
                local: this.localSelected,
                emisor: this.issuerSelected,
                operador: this.operatorSelected,
            };
            
            const data = await getSaldos(payload);
            this.transactions = data || [];
            console.log(this.transactions);

            if (this.transactions.length === 0) {
                toastr.warning("No se encontraron resultados");
            }
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }

      } else {
        toastr.error('Por favor complete los campos requeridos.');
      }

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
            'POS': row.pos,
            'Tipo de Transacción': row.trxType,
            'Tarjeta': row.tarNombre,
            'Número de Transacción': row.transactionNumber,
            'Monto ': row.amount,
            'Estado': row.status,
        }));

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Transacciones");
        XLSX.writeFile(wb, "Transacciones.xlsx");
    },

    clearFields() {
        this.chainSelected = '';
        this.localSelected = '';
        this.issuerSelected = '';
        this.operatorSelected = '';
        this.startDate = null;
        this.endDate = null;
        this.localOptions = [];
        this.transactions = [];
    },

    /* MÉTODO PARA ABRIR DIALOG DE DETALLE SALDO VIGENTE */
    async showDialogDetalleSalgoVigente(item) {
      console.log(item);
      this.dessertsDetalleSaldoVigente = [];
      try {        
            const payload = {
              fechashort: this.startDate,
              fechalong: null,
              sociedad: item.sociedad,
              local: item.id_local,
              emisor: item.id_emisor,
              grupo_banco: item.per_codigo_grupo_banco,
              cuenta_contable: item.per_cuenta_contable,
              f_liq_param_saldovig: null,
              trx_idcon: null,
              id_operador: item.id_operador,
              id_cadena: item.id_cadena,
              id_usuario: null,
              param_FLAG_HOME: null,
            };

            /* fecha: this.startDate,
                cadena: this.chainSelected,
                local: this.localSelected,
                emisor: this.selectedIssuer.value,
                operador: this.operatorSelected, */
            
            const data = await getDetalleSaldos(payload);
            this.dessertsDetalleSaldoVigente = data || [];
            console.log(this.dessertsDetalleSaldoVigente);

            if (this.dessertsDetalleSaldoVigente.length === 0) {
                toastr.warning("No se encontraron resultados");
            }
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
      this.dialogDetalleSaldoVigente = true;
    }
  }
,

  async mounted() {
    try {
      const chainResponse = await getCadenas();
      this.chainOptions = chainResponse || [];

      const issuerResponse = await getEmisores();
      this.issuerOptions = issuerResponse || [];

      /* const statusResponse = await getEstados();
      this.statusOptions = statusResponse || []; */
    } catch (error) {
      console.error("Error loading initial data:", error);
    }
  },
};
</script>

<style scoped>
/* Add your custom styles here */
.font-class-name1 {
  font-size: 1.2rem !important;
}
.button {
  height: 5.5vh !important;
}
.w-15 {
  width: 150px;
}
.ms-1, .ms-2 {
  margin-left: 10px;
}
.fake-link {
  color: #0000EE;
  text-decoration: none;
  cursor: pointer;
}
.fake-link:hover {
  color: #551A8B;
  text-decoration: none;
}
.fake-link:active {
  color: #FF0000;
}
</style>
