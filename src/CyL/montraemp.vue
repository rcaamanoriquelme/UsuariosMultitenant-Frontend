<template>
    <div>
      <v-toolbar flat color="white">
            <v-toolbar-title class="rdmqc">Transacciones con Error</v-toolbar-title>
      </v-toolbar>
      <v-expansion-panels class="pb-3">
      <v-expansion-panel>     
        <v-expansion-panel-header><i class="pe-7s-edit"> Filtros</i></v-expansion-panel-header>
        <v-expansion-panel-content>
      <v-row>
        <v-col cols="12" xs="12" sm="12" md="6" lg="4" xl="4">
          <v-menu v-model="menuStart" :close-on-content-click="false">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                class="font-class-name"
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
  
        <v-col cols="12" xs="12" sm="12" md="6" lg="4" xl="4">
          <v-menu v-model="menuEnd" :close-on-content-click="false">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                class="font-class-name"
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

        <!-- CADENAS -->
        <v-col cols="12" xs="12" sm="12" md="6" lg="4" xl="4">
          <v-autocomplete
          label="Cadena"
          class="font-class-name1"
          v-model="cadena"
          :items="chainOptions"
          item-text="value"
          item-value="id"
          clearable
          Dense                
          ></v-autocomplete>
      </v-col>
      
      </v-row>
  
      <v-row class="pa-6 justify-end">
        <v-btn :disabled="isSearchDisabled" class="w-15 ms-1 search-button" color="primary" @click="fetchTransactionErrors">
          <v-icon left>pe-7s-search</v-icon> Buscar
        </v-btn>
        <v-btn class="w-15 ms-2 export-button" color="success" @click="downloadExcel"><v-icon left>mdi-microsoft-excel</v-icon>Exportar</v-btn> 
      </v-row>
    </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
  
  <div>
    <v-data-table :headers="transactionErrorHeaders" :items="transactionErrors" class="elevation-1">
      <template v-slot:[`item.trxe_t_fecha`]="{ item }">
        {{ item.trxe_t_fecha }}
      </template>
      <template v-slot:[`item.trxe_t_hora`]="{ item }">
        {{ item.trxe_t_hora }}
      </template>
      <template v-slot:[`item.action`]="{ item }">
        <v-btn color="red" @click="openTransactionDetailDialog(item.id_trxe)">Detalles</v-btn>
      </template>
    </v-data-table>
  </div>
  
  <v-dialog v-model="dialog" max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline">Detalle de la transacción</span>
          </v-card-title>
  
          <v-card-text>
            <v-text-field label="ID Transacción" :value="transactionDetail && transactionDetail.id_trxe" readonly></v-text-field>
            <v-text-field label="Fecha y Hora" :value="transactionDetail ? formatDateTime(transactionDetail.trxe_t_fecha) : ''" readonly></v-text-field>
            <v-text-field label="Tipo Transacción" :value="transactionDetail && transactionDetail.trxe_tipo_trx" readonly></v-text-field>
            <v-text-field label="Emisor" :value="transactionDetail && transactionDetail.trxe_emisor" readonly></v-text-field>
            <v-text-field label="Comercio" :value="transactionDetail && transactionDetail.trxe_comercio" readonly></v-text-field>
            <v-text-field label="Local" :value="transactionDetail && transactionDetail.trxe_local" readonly></v-text-field>
            <v-text-field label="POS" :value="transactionDetail && transactionDetail.trxe_pos" readonly></v-text-field>
            <v-text-field label="Boleta" :value="transactionDetail && transactionDetail.trxe_boleta" readonly></v-text-field>
            <v-text-field label="Fecha Contable" :value="transactionDetail ? formatDateTime(transactionDetail.trxe_fechacont) : ''" readonly></v-text-field>
            <v-text-field label="Estado Transacción" :value="transactionDetail && transactionDetail.id_estado_trxe" readonly></v-text-field>
            <v-text-field label="Número Transacción" :value="transactionDetail && transactionDetail.trxe_numero" readonly></v-text-field>
            <v-text-field label="Versión" :value="transactionDetail && transactionDetail.trxe_version" readonly></v-text-field>
            <v-text-field label="Journal" :value="transactionDetail && transactionDetail.trxe_journal" readonly></v-text-field>
            <v-text-field label="Estado" :value="transactionDetail && transactionDetail.trxe_estado" readonly></v-text-field>
            <v-text-field label="Código Rechazo" :value="transactionDetail && transactionDetail.trxe_cod_rechazo" readonly></v-text-field>
            <v-text-field label="Glosa Rechazo" :value="transactionDetail && transactionDetail.trxe_glosa_rech" readonly></v-text-field>
            <v-text-field label="Tarjeta" :value="transactionDetail && transactionDetail.trxe_tarjeta" readonly></v-text-field>
            <v-text-field label="Monto" :value="transactionDetail && transactionDetail.trxe_monto" readonly></v-text-field>
            <v-text-field label="Cuotas" :value="transactionDetail && transactionDetail.trxe_cuotas" readonly></v-text-field>
            <v-text-field label="Últimos 4 Dígitos" :value="transactionDetail && transactionDetail.trxe_ult4_dig" readonly></v-text-field>
            <v-text-field label="TS Req" :value="transactionDetail ? formatDateTime(transactionDetail.trxe_ts_req) : ''" readonly></v-text-field>
            <v-text-field label="TS Rsp" :value="transactionDetail ? formatDateTime(transactionDetail.trxe_ts_rsp) : ''" readonly></v-text-field>
            <v-text-field label="IDCON" :value="transactionDetail && transactionDetail.trxe_idcon" readonly></v-text-field>
            <v-text-field label="Número Tarjeta" :value="transactionDetail && transactionDetail.trxe_numtarjeta" readonly></v-text-field>
            <v-text-field label="Código Autorización" :value="transactionDetail && transactionDetail.trxe_codautor" readonly></v-text-field>
            <v-text-field label="País" :value="transactionDetail && transactionDetail.trxe_pais" readonly></v-text-field>
            <v-text-field label="Cadena" :value="transactionDetail && transactionDetail.trxe_cadena" readonly></v-text-field>
            <v-text-field label="Vendedor Cajero" :value="transactionDetail && transactionDetail.trxe_vend_caj" readonly></v-text-field>
            <v-text-field label="Estado Re" :value="transactionDetail && transactionDetail.trxe_estadore" readonly></v-text-field>
            <v-text-field label="Llave" :value="transactionDetail && transactionDetail.trxe_llave" readonly></v-text-field>
            <v-text-field label="IP" :value="transactionDetail && transactionDetail.trxe_ip" readonly></v-text-field>
        
          </v-card-text>
  
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="dialog = false">Cerrar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </template>
  
  <script>
  import TransactionErrorService from '@/services/montraemp';
  import { format } from 'date-fns';
  import * as XLSX from 'xlsx';
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
        startDate: null,
        endDate : null,
        menuStart: false,
        menuEnd: false,
        dialog: false,
        transactionDetail: null,
        transactionErrors: [],
        transactionErrorHeaders: [
          { text: 'Fecha', value: 'trxe_t_fecha', sortable: false },
          { text: 'Hora', value: 'trxe_t_hora', sortable: false },
          { text: 'Motivo de Error', value: 'etrxe_nombre' },
          { text: 'Acciones', value: 'action', sortable: false },
        ],

        //CADENA
        cadena: null,
        chainOptions: [],

        //EXCEL
        transactionErrorsCsv: [],
        transactionErrorHeadersCsv: [
          { text: 'Fecha Error', value: 'trxe_t_fecha', sortable: false },
          { text: 'Hora Error', value: 'trxe_t_hora', sortable: false },
          { text: 'Error', value: 'etrxe_nombre' },
          { text: 'Cod TipoTrx', value: 'action', sortable: false },
          { text: 'Tipo Trx', value: 'etrxe_nombre' },
          { text: 'Cod Emisor', value: 'etrxe_nombre' },
          { text: 'Emisor', value: 'etrxe_nombre' },
          { text: 'Cod Comercio', value: 'etrxe_nombre' },
          { text: 'Comercio', value: 'etrxe_nombre' },
          { text: 'Cod Local', value: 'etrxe_nombre' },
          { text: 'Local', value: 'etrxe_nombre' },
          { text: 'IP', value: 'etrxe_nombre' },
          { text: 'POS', value: 'etrxe_nombre' },
          { text: 'Boleta', value: 'etrxe_nombre' },
          { text: 'Fecha', value: 'etrxe_nombre' },
          { text: 'Hora', value: 'etrxe_nombre' },
          { text: 'Numero', value: 'etrxe_nombre' },
          { text: 'Version', value: 'etrxe_nombre' },
          { text: 'Journal', value: 'etrxe_nombre' },
          { text: 'Estado', value: 'etrxe_nombre' },
          { text: 'Cod Rechazo', value: 'etrxe_nombre' },
          { text: 'Glosa Rech', value: 'etrxe_nombre' },
          { text: 'Cod Tarjeta', value: 'etrxe_nombre' },
          { text: 'Tarjeta', value: 'etrxe_nombre' },
          { text: 'Monto', value: 'etrxe_nombre' },
          { text: 'Cuotas', value: 'etrxe_nombre' },
          { text: 'Ult 4Dig', value: 'etrxe_nombre' },
          { text: 'Envio', value: 'etrxe_nombre' },
          { text: 'Respuesta', value: 'etrxe_nombre' },
          { text: 'Id Con', value: 'etrxe_nombre' },
          { text: 'Num Tarjeta', value: 'etrxe_nombre' },
          { text: 'Cod Autor', value: 'etrxe_nombre' },
          { text: 'Pais', value: 'etrxe_nombre' },
          { text: 'Cadena', value: 'etrxe_nombre' },
          { text: 'Vendedor', value: 'etrxe_nombre' },
          { text: 'Estado Rechazo', value: 'etrxe_nombre' },
          { text: 'Estado Portal', value: 'etrxe_nombre' },
          { text: 'Llave', value: 'etrxe_nombre' },
          { text: 'Pin', value: 'etrxe_nombre' },
          { text: 'Cod MPago', value: 'etrxe_nombre' },
          { text: ' Mpago', value: 'etrxe_nombre' },
          { text: 'Vuelto', value: 'etrxe_nombre' },
          { text: 'Fecha Cont', value: 'etrxe_nombre' }
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
      },

  },
    methods: {

      formatDateTime(dateTime) {
      if (!dateTime) return '';

      const [fecha, hora] = dateTime.split('T');
      const fechaFormateada = fecha.split('-').reverse().join('-');
      const horaFormateada = hora.substring(0, 8);

      return `${fechaFormateada} ${horaFormateada}`;
    },

      formatDate(dateStr) {
        if (!dateStr) return null;
        const [year, month, day] = dateStr.split('-').map(Number);
        const date = new Date(year, month - 1, day); 
        return format(date, 'dd/MM/yyyy');
      },

      async fetchChains() {
        const response = await TransactionErrorService.fetchChains();
        this.chainOptions = response;
        console.log('fetchChains:', this.chainOptions);
      },

      async downloadExcel() {

        if (this.transactionErrors.length === 0) {
          toastr.warning('No hay registros para exportar');
          return;
        }

        // CONSUME SERVICIO DE TRANSACCIONES CON ERROR CSV
        this.transactionErrorsCsv = [];

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

        if (this.cadena == "") {
          this.cadena = null;
        }

        const response = await TransactionErrorService.fetchTransactionErrorsCsv({
          fechaInicio: this.startDate,
          fechaFinal: this.endDate,
          idCadena: this.cadena
        });

        if (response.data.length != 0) {
          response.data.forEach((objTransaccionesErrorCsv) => {

            this.transactionErrorsCsv.push(objTransaccionesErrorCsv);

          });
        }

        try {
                if (this.transactionErrorsCsv.length > 0) {
                    let data = this.transactionErrorsCsv.map(row => ({
                    'Fecha Error': row.trxe_t_fecha.split('T')[0].split('-').reverse().join('-'),
                    'Hora Error': row.trxe_t_fecha.split('T')[1].substring(0, 8),
                    'Error': row.etrxe_nombre,
                    'Cod TipoTrx': row.trxe_tipo_trx,
                    'Tipo Trx': row.tte_nombre,
                    'Cod Emisor': row.trxe_emisor,
                    'Emisor': row.emi_nombre,
                    'Cod Comercio': row.trxe_comercio,
                    'Comercio': row.com_nombre,
                    'Cod Local': row.trxe_local,
                    'Local': row.loc_nombre,
                    'IP': row.trxe_ip,
                    'POS': row.trxe_pos,
                    'Boleta': row.trxe_boleta,
                    'Fecha': row.trxe_fecha.split('T')[0].split('-').reverse().join('-'),
                    'Hora': row.trxe_hora.split('T')[1].substring(0, 8),
                    'Numero': row.trxe_numero,
                    'Version': row.trxe_version,
                    'Journal': row.trxe_journal,
                    'Estado': row.trxe_estado,
                    'Cod Rechazo': row.trxe_cod_rechazo,
                    'Glosa Rech': row.trxe_glosa_rech,
                    'Cod Tarjeta': row.trxe_tarjeta,
                    'Tarjeta': row.tar_nombre,
                    'Monto': row.trxe_monto.toFixed(2),
                    'Cuotas': row.trxe_cuotas,
                    'Ult 4Dig': ('0000' + row.trxe_ult4_dig).toString().slice(-4),
                    'Envio': this.formatDateTime(row.trxe_ts_req),
                    'Respuesta': this.formatDateTime(row.trxe_ts_rsp),
                    'Id Con': row.trxe_idcon,
                    'Num Tarjeta': row.trxe_numtarjeta,
                    'Cod Autor': row.trxe_codautor,
                    'Pais': row.trxe_pais,
                    'Cadena': row.trxe_cadena,
                    'Vendedor': row.trxe_vend_caj,
                    'Estado Rechazo': row.trxe_estadore,
                    'Estado Portal': row.trxe_estado_portal,
                    'Llave': row.trxe_llave,
                    'Pin': row.trxe_pin,
                    'Cod MPago': row.trxe_mpago,
                    ' Mpago': row.mpa_nombre,
                    'Vuelto': row.trxe_vuelto.toFixed(2),
                    'Fecha Cont': row.trxe_fechacont.split('T')[0].split('-').reverse().join('-')

                    }));
                    const ws = XLSX.utils.json_to_sheet(data);
                    const wb = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(wb, ws, "Transactions");
                    XLSX.writeFile(wb, "Transactions.xlsx");
                    toastr.success('Se generó la planilla con éxito.');
                } else {
                  toastr.warning('No hay registros para exportar');
                }
                
            } catch (error) {
                console.log(error);
                toastr.error('Hubo un error al generar planilla.');
            }

      },
      async fetchTransactionErrors() {

        this.transactionErrors = [];
        
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

        if (this.cadena == "") {
          this.cadena = null;
        }

        const response = await TransactionErrorService.fetchTransactionErrors({
          fechaInicio: this.startDate,
          fechaFinal: this.endDate,
          idCadena: this.cadena
        });

        if (response.data.length != 0) {
          response.data.forEach((objTransaccionesError) => {
            
            const fechaHoraOriginal = objTransaccionesError.trxe_t_fecha;

            // Separar la fecha y la hora
            const partesDateTime = fechaHoraOriginal.split('T');
            const fechaOriginal = partesDateTime[0]; // Fecha en formato '2023-10-03'
            const horaOriginal = partesDateTime[1]; // Hora en formato '12:39:31.418+00:00'

            // Formatear la fecha a DD-MM-YYYY
            const partesFecha = fechaOriginal.split('-');
            const fechaFormateada = partesFecha.reverse().join('-');

            // Extraer la hora en formato HH:MM:SS
            const horaFormateada = horaOriginal.substring(0, 8);

            // Asignar los valores formateados de vuelta al objeto
            objTransaccionesError.trxe_t_fecha = fechaFormateada;
            objTransaccionesError.trxe_t_hora = horaFormateada;

            this.transactionErrors.push(objTransaccionesError);

          });
        }

        //this.transactionErrors = response.data;

        if (this.transactionErrors.length === 0) {
          toastr.warning("No se encontraron resultados");
        } else {
          toastr.info("Se encontraron " + this.transactionErrors.length + " registros.");
        }
      },
      async fetchTransactionDetail(id_trxe) {

        const response = await TransactionErrorService.fetchTransactionDetail(id_trxe);
        this.transactionDetail = response.data;
      },
      openTransactionDetailDialog(id_trxe) {
        this.fetchTransactionDetail(id_trxe);
        this.dialog = true;
      },
      formatTime(dateString) {
        const date = new Date(dateString);
        return date.toLocaleTimeString();
      },
      clearFields() {
        this.startDate = null;
        this.endDate = null;
        this.transactionErrors = [];
      },
    },
    created() {
      this.fetchChains();
    },
  };
  </script>
  
<style>
  
.font-class-name * {
   font-size: 12px;
}

.font-class-name1 * {
   font-size: 12px;
}

</style>