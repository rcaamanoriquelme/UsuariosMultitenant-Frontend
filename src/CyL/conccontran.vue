<template>
  <v-data-table 
    v-model="selected" 
    :headers="headers" 
    :items="filteredDesserts"
    :loading="loadTable"
    loading-text="Cargando Transacciones..."
    :search="search"
    :single-select="singleSelect" 
    sort-by="id_trx" 
    item-key="id_trx" 
    :items-per-page="10"
    show-select 
    class="row-height1-30 elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat color="white">
        <subtitle-2 class="rdmqc" :name="name"> 	
                Consulta de Transacciones Medios de Pago</subtitle-2>
      </v-toolbar>
      
      <v-toolbar flat color="white">
            <subtitle-2 class="rdmqc" :name="name"></subtitle-2>
                <v-spacer></v-spacer>
                <v-row>
                    <v-col cols="3">
                        <v-row class="pa-6">
                          <v-menu
                            v-model="menu1"
                            :close-on-content-click="false"
                            :nudge-right="40"
                            transition="scale-transition"
                            offset-y
                            min-width="auto"
                          >
                            <template v-slot:activator="{ on }">
                              <v-text-field
                                class="font-class-name"
                                v-model="computedDateFormatted1"
                                label="Fecha Desde"
                                prepend-icon="event"
                                readonly
                                v-on="on"
                                clearable
                                @click:clear="startDate = null"
                              ></v-text-field>
                            </template>
                            <v-date-picker
                              v-model="startDate"
                              @input="menu1 = false"
                            ></v-date-picker>
                          </v-menu>
                        </v-row>
                    </v-col>

                    <v-col cols="3">
                        <v-row class="pa-6">
                          <v-menu
                            v-model="menu2"
                            :close-on-content-click="false"
                            :nudge-right="40"
                            transition="scale-transition"
                            offset-y
                            min-width="auto"
                          >
                            <template v-slot:activator="{ on }">
                              <v-text-field
                                class="font-class-name"
                                v-model="computedDateFormatted2"
                                label="Fecha Hasta"
                                prepend-icon="mdi-calendar"
                                readonly
                                v-on="on"
                                clearable
                                @click:clear="endDate = null"
                              ></v-text-field>
                            </template>
                            <v-date-picker
                              v-model="endDate"
                              @input="menu2 = false"
                            ></v-date-picker>
                          </v-menu>
                        </v-row>
                    </v-col>                 

                    <v-col cols="3">
                      <v-row class="pa-6"> 
                        <v-autocomplete
                          label="Local"
                          class="font-class-name1"
                          v-model="localFilterValue"
                          :items="blocales"
                          item-text="loc_nombre"
                          item-value="loc_nombre"
                          clearable
                          Dense                     
                        ></v-autocomplete>
                      </v-row> 
                    </v-col>
                    
                    <v-col cols="2">
                        <v-row class="pa-6">
                          <v-tooltip right>
                            <template v-slot:activator="{ on, attrs }"> 
                            <v-btn v-bind="attrs" v-on="on" color="primary" dark class="mb-2" :loading="isSelecting" fab Extra small Button @click="exportExcel()">
                              <v-icon dark>mdi-microsoft-excel</v-icon> 
                            </v-btn>
                            </template>
                            <span>Exportar Excel</span>
                          </v-tooltip> 
                        </v-row>
                    </v-col>
                
                </v-row>
<!--Dialogo-->
        <v-dialog v-model="dialog"
          fullscreen
          hide-overlay
        >
          <v-card>

            <v-toolbar dark color="primary">
              <v-btn icon dark @click.native="dialog = false">
                <v-icon>close</v-icon>
              </v-btn>              
              <v-toolbar-title>Detalles</v-toolbar-title>
            </v-toolbar>

            <v-tabs>
            <v-tab href="#tab-1">General</v-tab>
            <v-tab-item value="tab-1" transition="fade-transition" >
              {{ ver_json }}
              <br />
            </v-tab-item>
          </v-tabs>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">Cerrar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
<!--Dialogo-->
        <v-dialog v-model="dialog1" max-width="500px">
          <v-card>

            <v-toolbar dark color="primary">
              <v-btn icon dark @click.native="dialog1 = false">
                <v-icon>close</v-icon>
              </v-btn>              
              <v-toolbar-title>Cambiar Estatus</v-toolbar-title>
            </v-toolbar>

            <v-col cols="12" sm="6" md="6">
              <v-select
                  label="Estatus"
                  v-model="env_estatus"
                  :items="itemsestado"
                  item-text="itemtext"
                  item-value="itemvalue"
              ></v-select>
            </v-col>

            <v-col cols="12" sm="6" md="6">
              <v-text-field v-model="env_estatus1" label="Autorizacion" required></v-text-field>
            </v-col>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="initialize1">Enviar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
<!--Dialogo-->
        <v-dialog v-model="dialog2" max-width="500px">
          <v-card>
            <v-toolbar dark color="primary">
              <v-btn icon dark @click.native="dialog2 = false">
                <v-icon>close</v-icon>
              </v-btn>              
              <v-toolbar-title>Busqueda General</v-toolbar-title>
            </v-toolbar>

            <v-col cols="12" sm="6" md="6">
              <v-text-field v-model="env_trxnum" label="Numero Transaccion"></v-text-field>
            </v-col> 

            <v-col cols="12" sm="6" md="6">

                  <v-menu
                    v-model="menu3"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        class="font-class-name"
                        v-model="computedDateFormatted3"
                        label="Fecha Desde"
                        prepend-icon="event"
                        readonly
                        v-on="on"
                        clearable
                        @click:clear="env_startDate = null"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="env_startDate"
                      @input="menu3 = false"
                    ></v-date-picker>
                  </v-menu>

            </v-col>

            <v-col cols="12" sm="6" md="6">

                  <v-menu
                    v-model="menu4"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        class="font-class-name"
                        v-model="computedDateFormatted4"
                        label="Fecha Hasta"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-on="on"
                        clearable
                        @click:clear="env_endDate = null"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="env_endDate"
                      @input="menu4 = false"
                    ></v-date-picker>
                  </v-menu>

            </v-col>                 

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="initialize1">Buscar</v-btn>
              <v-btn color="blue darken-1" text @click="initialize1">Cerrar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>       
<!--Dialogo Fin-->
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon class="mr-2" @click="editItem(item)">mdi-folder-search</v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize">No Hay Datos</v-btn>
    </template>
  </v-data-table>
</template>

<script>
import TesleetransaService from "../services/TesleetransaService";
import TeslocalesService from "../services/TeslocalesService";
import XLSX from "xlsx";

export default {
  data() {
    return {
    menu1: '',
    menu2: '',
    menu3: '',
    menu4: '',
    search: "",
    localFilterValue: '',
    isSelecting: false,
    singleSelect: false,
    selected: [],
    dialog: false,
    dialog1: false,
    dialog2: false,
    desserts: [],
    editedIndex: -1,
    startDate:null,
    endDate:null,
    loadTable: true,
    response: '',
    name: '',
    data1: '',
    date:null,
    date1:null,
    fechaDate:null,
    env_estatus: '',
    env_estatus1: '',
    env_startDate:null,
    env_endDate:null,
    ver_json: '',
    blocales: [],
    blocales1: [],

    headers: [
      {
        text: "Fecha",
        align: "start",
//      sortable: false,
        value: "trxfecha"
      },
      { text: "Fecha Abono", value: "liq_fechapago" },
      { text: "Cadena", value: "cad_nombre" },
      { text: "Local", value: "loc_nombre", width: "180", align: "center" },
      { text: "Emisor", value: "emi_nombre", width: "150" },
      { text: "Operador", value: "operador", width: "150"},
      { text: "Tipo Trx", value: "tipotrx" },
      { text: "Pos", value: "trx_pos" },
      { text: "N° trx", value: "trx_num" },
      { text: "N° Tarjeta/Vale", value: "trx_numtarjeta" },
      { text: "Monto Total", value: "trx_monto" },
      { text: "Estado Conciliacion", value: "ecn_descripcion" },
      { text: "Cod Autor", value: "trx_codautor" },
      { text: "Estado Liquidacion", value: "eli_descripcion" },
      { text: "Monto Liquidado", value: "trx_montoliquidado" },
      { text: "Medio Pago", value: "emi_nombre", width: "120" },
      { text: "Disefec", value: "disefec" },
      { text: "Cambio Pago", value: "cambiopago" },
      { text: "IdTrx", value: "trx_idcon" }
    ],

    editedItem: {
    },

    };
  },

  computed: {
    filteredDesserts() {  
    const conditions = [];

    if (this.localFilterValue) {
      console.log("this.localFilterValue: ", this.localFilterValue );
      conditions.push(this.filterLocal);
    }

    if (this.startDate && this.endDate) {
      conditions.push(this.filterFechas);
    }
  
    if (conditions.length > 0) {
      return this.desserts.filter((dessert) => {
        return conditions.every((condition) => {
          return condition(dessert);
        })
      })
    }     
    return this.desserts;
    },
   
    computedDateFormatted1() {
      return this.formatDate1(this.startDate);
    },

    computedDateFormatted2() {
      return this.formatDate1(this.endDate);
    },

    computedDateFormatted3() {
      return this.formatDate1(this.env_startDate);
    },

    computedDateFormatted4() {
      return this.formatDate1(this.env_endDate);
    } 

  },

  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  created() {
    this.initialize();
  },

  methods: {
    formatDate1(date) {
      if (!date) return null;
      const [year, month, day] = date.split("-");
      return `${day}/${month}/${year}`;
    },

    filterLocal(item) {
      this.nombrelocal = this.localFilterValue;
      this.nombrelocal1 = item.loc_nombre;
      console.log("EDITED LOCALNUMERO: ", this.nombrelocal)
      console.log("ITEM LOCALNUMERO: ", this.nombrelocal1)
      if (this.nombrelocal) {
        return this.nombrelocal == this.nombrelocal1;
      }
    },

    filterFechas(item) {
      const startDate = this.localizeDate(this.startDate);
      console.log("startDate: ", startDate);
      const endDate = this.localizeDate(this.endDate);
      console.log("endDate: ", endDate);

      this.fechaDate = item.trxfecha;
      console.log("item.trxfecha: ", this.fechaDate);
      this.fechaDate = this.fechaDate.split('-');
      this.fechaDate = this.fechaDate[1] + "/" + this.fechaDate[0] + "/" + this.fechaDate[2]
      console.log("item.trxfecha 1: ", this.fechaDate);

      const itemDate = new Date(this.fechaDate);
      console.log("itemDate: ", itemDate);
      if (startDate && endDate) {
        return startDate <= itemDate && itemDate <= endDate;
      }
      if (startDate && !endDate) {
        return startDate <= itemDate;
      }
      if (!startDate && endDate) {
        return itemDate <= endDate;
      }

    },  

    initialize() {  
      this.loadTable= false;
      this.env_estatus = "";
      this.env_estatus1 = "";
      this.env_trxnum = 0;
      this.env_startDate = null;
      this.env_endDate = null;    
      this.desserts = [];
      this.dialog2 = true;
    },

    async initialize1() {
      try {
        this.buscarLocales();
        this.dialog2 = false;
        this.loadTable = true;
        this.env_startDate = this.env_startDate;
        this.env_endDate = this.env_endDate;
        var dataloc = {
            trxnumero: this.env_trxnum,
            startDate: this.env_startDate,
            endDate: this.env_endDate,
        };

        console.log("initialize1", dataloc);
        this.data1 = JSON.parse(localStorage.getItem('loginData'));
        console.log('LOGINDATA: ', this.data1);
        if (this.data1 === "localespos") {
            this.response = await TesleetransaService.getAll(dataloc);
//            setTimeout(() => this.buscarLocales(), 300);
        }
        this.desserts = this.response.data;
        console.log("Initialize Enviovta: ",this.desserts);

        for (let i = 0; i < this.desserts.length; i++) {
          var disefece = "0,00";
          var disefec1 = { disefec: disefece };
          Object.assign(this.desserts[i], disefec1);

          var cambiopago = "No";
          var cambiopago1 = { cambiopago: cambiopago };
          Object.assign(this.desserts[i], cambiopago1);

          var operador = "Real Plaza Mixto";
          var operador1 = { operador: operador };
          Object.assign(this.desserts[i], operador1);

          var tipotrx = "Venta";
          var tipotrx1 = { tipotrx: tipotrx };
          Object.assign(this.desserts[i], tipotrx1);
         
          if(this.desserts[i].trxfecha) {
            this.desserts[i].trxfecha = this.desserts[i].trxfecha.split(' ');            
            this.desserts[i].trxfecha = this.desserts[i].trxfecha[0];
            this.desserts[i].trxfecha= this.desserts[i].trxfecha.split('-');
            this.desserts[i].trxfecha = this.desserts[i].trxfecha[2] + "/" + this.desserts[i].trxfecha[1] + "/" + this.desserts[i].trxfecha[0];
          } 

          if(this.desserts[i].liq_fechapago) {
            this.desserts[i].liq_fechapago = this.desserts[i].liq_fechapago.split(' ');            
            this.desserts[i].liq_fechapago = this.desserts[i].liq_fechapago[0];
            this.desserts[i].liq_fechapago = this.desserts[i].liq_fechapago.split('-');
            this.desserts[i].liq_fechapago = this.desserts[i].liq_fechapago[2] + "/" + this.desserts[i].liq_fechapago[1] + "/" + this.desserts[i].liq_fechapago[0];
          }        
        }

        const dario = this.desserts.length;       
        console.log("Total Leidos: ",dario);
        console.log("Total Envio listo: ",this.desserts);
        this.loadTable= false;
      } catch (error) {
        console.log(error);
      }
    },

    async buscarLocales() {
      try {
        const response = await TeslocalesService.getAll();
        this.blocales1 = response.data;
        console.log("Total Locales: ",this.blocales1);
        this.blocales = this.blocales1.filter(a => {
          return (a.activo === '1');
        });
        this.blocales.sort(function(a, b){return a.loc_codigo - b.loc_codigo});
        console.log("Tipo: ",this.blocales);
        this.loadTable1= false;

        console.log("Tipo 1: ",this.blocales);

      } catch (error) {
        console.log(error);
      }
    },

    editItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      console.log("this.editedItem: ", this.editedItem);
    },

    exportExcel() {
      let data = XLSX.utils.json_to_sheet(this.desserts,
      {
        header: ['trx_fecha', 'liq_fechapago', 'cad_nombre', 'loc_nombre', 'emi_nombre', 'operador', 'tipotrx', 'trx_pos', 'trx_num', 'trx_numtarjeta', 'trx_monto', 'ecn_descripcion' , 'trx_codautor', 'eli_descripcion', 'trx_montoliquidado', 'emi_nombre', 'disefec', 'cambiopago', 'trx_idcon']
      }
      )
      data['A1'].v = 'Fecha'
      data['B1'].v = 'Fecha Abono'
      data['C1'].v = 'Cadena'
      data['D1'].v = 'Local'
      data['E1'].v = 'Emisor'
      data['F1'].v = 'Operador'
      data['G1'].v = 'Tipo Trx'
      data['H1'].v = 'Pos'
      data['I1'].v = 'N° Trx'
      data['J1'].v = 'N° Tarjeta/Vale'
      data['K1'].v = 'Monto Total S/.'
      data['L1'].v = 'Estado Conciliacion'
      data['M1'].v = 'Cod.Autor'
      data['N1'].v = 'Estado Liquidacion'
      data['O1'].v = 'Monto Liquidado/S.'
      data['P1'].v = 'Medio Pago'
      data['Q1'].v = 'Disefec. S/.'
      data['R1'].v = 'Cambio de Pago'
      data['S1'].v = 'IdTrx'
      const workbook = XLSX.utils.book_new()
      const filename = 'reporte-transacciones'
      XLSX.utils.book_append_sheet(workbook, data, filename)
      XLSX.writeFile(workbook, `${filename}.xlsx`)
    },

    close() {
      this.dialog = false;
      this.dialog1 = false;
      this.dialog2 = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

     localizeDate(date) {
       // Date picker uses ISO format (yyyy-mm-dd), which is UTC. The data
       // contains locale specific date strings (mm/dd/yyyy), which `Date`
       // parses with local time-zone offset instead of UTC. Normalize the
       // ISO date so we're comparing local times.
       if (!date || !date.includes('-')) return date
       const [yyyy, mm, dd] = date.split('-')
       return new Date(`${mm}/${dd}/${yyyy}`)
     },

  }
};
</script>

<style>

.v-data-table.row-height1-30 td {
  font-size: 10px !important;
  height: 30px !important;
}

.font-class-name * {
   font-size: 12px;
}

.rdmqc {
  color: #2B81D5
}

.font-class-name1 * {
   font-size: 12px;
}

.v-autocomplete__content{
  font-size: 8px;
}

</style>