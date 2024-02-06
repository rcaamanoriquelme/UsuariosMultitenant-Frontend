<template>
    <div>
        <!-- LOADER -->
        <VueElementLoading :active="loader" spinner="bar-fade-scale" color="var(--primary)"/>

        <!-- CONFIGURACIÓN TABLA -->
        <v-data-table 
        v-model="selected"
        :headers="tableHeaders"
        :items="desserts"
        :loading="loadTable"
        loading-text="Cargando Transacciones..."
        :search="search"
        sort-by="listaPedidosNoConciliados.trx_usuario7"
        item-key="listaPedidosNoConciliados.trx_usuario7"
        :items-per-page="10"
        class="row-height1-30 elevation-1"
        :footer-props="{
           'items-per-page-text':'Registros por página',
           'pageText': '{0}-{1} de {2}'
        }"
        >
            <template v-slot:top>

                <!-- TÍTULO PANTALLA -->
                <v-toolbar flat color="white">
                    <v-toolbar-title class="rdmqc">Pedidos No Conciliados</v-toolbar-title>
                </v-toolbar>

                <!-- EXPANDER PARA FILTROS -->
                <v-expansion-panels class="pb-3">
                    <v-expansion-panel>
                        <v-expansion-panel-header><i class="pe-7s-edit"> Filtros</i></v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <v-container>

                                    <!--INPUTS-->
                                    <v-row>
                                        <!-- FECHA INICIO -->
                                        <v-col cols="12" xs="12" sm="12" md="6" lg="2" xl="2">
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
                                                        <!--  -->
                                                </template>
                                                <v-date-picker
                                                v-model="startDate"
                                                @input="menu1 = false"
                                                ></v-date-picker>
                                            </v-menu>
                                        </v-col>
                                        
                                        <!-- FECHA TERMINO -->
                                        <v-col cols="12" xs="12" sm="12" md="6" lg="2" xl="2">
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
                                        </v-col>

                                        <!-- CADENAS -->
                                        <v-col cols="12" xs="12" sm="12" md="6" lg="2" xl="2">
                                            <v-autocomplete
                                            label="Cadenas"
                                            class="font-class-name1"
                                            v-model="cadenaFilterValue"
                                            :items="cadenas"
                                            item-text="cadNombre"
                                            item-value="idCadena"
                                            clearable
                                            Dense    
                                            @change="getLocalesByCadena"                 
                                            ></v-autocomplete>
                                        </v-col>

                                        <!-- LOCALES -->
                                        <v-col cols="12" xs="12" sm="12" md="6" lg="3" xl="3">
                                            <v-autocomplete
                                            label="Locales"
                                            class="font-class-name1 custom-autocomplete"
                                            v-model="localFilterValue"
                                            :items="blocales"
                                            item-text="loc_nombre"
                                            item-value="id_local"
                                            clearable        
                                            ></v-autocomplete>
                                        </v-col>

                                        <!-- PEDIDO VTEX -->
                                        <v-col cols="12" xs="12" sm="12" md="6" lg="3" xl="3">
                                            <v-text-field
                                            v-model="pedidoVtexFilterValue"
                                            label="Ingrese Pedido Vtex"></v-text-field>
                                            <!-- <v-autocomplete
                                            label="Locales"
                                            class="font-class-name1 custom-autocomplete"
                                            v-model="localFilterValue"
                                            :items="blocales"
                                            item-text="loc_nombre"
                                            item-value="id_local"
                                            clearable    
                                            multiple         
                                            ></v-autocomplete> -->
                                        </v-col>
                                    </v-row>

                                    <v-row>
                                        <!-- ESTADO -->
                                        <v-col cols="12" xs="12" sm="12" md="6" lg="3" xl="3">
                                            <v-autocomplete
                                            label="Estados"
                                            class="font-class-name1"
                                            v-model="estadoFilterValue"
                                            :items="estados"
                                            item-text="valor"
                                            item-value="codigo"
                                            clearable
                                            Dense                
                                            ></v-autocomplete>
                                        </v-col>

                                        <!-- EMISORES -->
                                        <v-col cols="12" xs="12" sm="12" md="6" lg="3" xl="3">
                                            <v-autocomplete
                                            label="Emisores"
                                            class="font-class-name1 custom-autocomplete"
                                            v-model="emisorFilterValue"
                                            :items="emisores"
                                            item-text="emiNombre"
                                            item-value="idEmisor"
                                            clearable
                                            @change="getOperadoresByEmisor"                       
                                            ></v-autocomplete>
                                        </v-col>

                                        <!-- OPERADORES -->
                                        <v-col cols="12" xs="12" sm="12" md="6" lg="3" xl="3">
                                            <v-autocomplete
                                            label="Operadores"
                                            class="font-class-name1"
                                            v-model="operadorFilterValue"
                                            :items="operadores"
                                            item-text="opeNombre"
                                            item-value="idOperador"
                                            clearable
                                            Dense                
                                            ></v-autocomplete>
                                        </v-col>

                                        <!-- FALTANTES -->
                                        <v-col cols="12" xs="12" sm="12" md="6" lg="3" xl="3">
                                            <v-autocomplete
                                            label="Faltantes"
                                            class="font-class-name1"
                                            v-model="faltanteFilterValue"
                                            :items="faltantes"
                                            item-text="nombre"
                                            item-value="codigo"
                                            clearable
                                            Dense                 
                                            ></v-autocomplete>
                                        </v-col>
                                    </v-row>

                                    <!--BOTONES-->
                                    <v-row>
                                        <v-spacer></v-spacer>

                                        <!-- GENERAR DETALLE -->
                                        <v-col cols="12" xs="12" sm="12" md="6" lg="2" xl="2">
                                            <b-button class="btn-sm btn-icon w-100" variant="primary" @click="detalleByFiltro">
                                            <i class="pe-7s-search btn-icon-wrapper"></i>Buscar
                                            </b-button>
                                        </v-col>

                                        <!-- EXPORTAR EXCEL -->
                                        <v-col cols="12" xs="12" sm="12" md="6" lg="2" xl="2">
                                            <b-button class="btn-sm btn-icon w-100" variant="success" @click="exportarPlanilla">
                                            <v-icon dark>mdi-microsoft-excel</v-icon>Exportar
                                            </b-button>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>

            </template>
            <template v-slot:no-data>
                <span>No hay registros</span>
            </template>
        </v-data-table>
    </div>
</template>
<script>


import { getCadenas, getLocales, getEstados, getEmisores, getFaltantes, getLocalesByCadena, getOperadoresByEmisor, getDetalleByFiltro } from '../services/ConspednconService';
import Vue from 'vue';
import VueNotifications from 'vue-notifications';
import toastr from 'toastr';
import "toastr/build/toastr.min.css";
import VueElementLoading from "vue-element-loading";
import * as XLSX from 'xlsx';
import config from '../../config.js';

/* CONFIGURACION ALERTAS */
function toast ({title, message, type, timeout}) {
  if (type === VueNotifications.types.warn) type = 'warning'
  return toastr[type](message, title, {timeOut: timeout})
}
const options = {
  success: toast,
  error: toast,
  info: toast,
  warn: toast
}
Vue.use(VueNotifications, options)


export default {

    components: {
        VueElementLoading
    },

    notifications: {
        showSuccessMsg: {
            type: VueNotifications.types.success,
            title: 'Éxito',
            message (mensaje) {
                return mensaje
            }
        },
        showInfoMsg: {
            type: VueNotifications.types.info,
            title: 'Información',
            message (mensaje) {
                return mensaje
            }
        },
        showWarnMsg: {
            type: VueNotifications.types.warn,
            title: 'Advertencia',
            message (mensaje) {
                return mensaje
            }
        },
        showErrorMsg: {
            type: VueNotifications.types.error,
            title: 'Error',
            message (mensaje) {
                return mensaje
            }
        }
    },

    data(){
        return {
            //LOADER
            loader: false,
            //FILTROS
            menu1: '',
            menu2: '',
            startDate:null,
            endDate:null,
            cadenaFilterValue: '',
            cadenas: [],
            localFilterValue: '',
            blocales:[],
            pedidoVtexFilterValue: '',
            estadoFilterValue: '',
            estados: [],
            emisorFilterValue: '',
            emisores: [],
            operadorFilterValue: '',
            operadores: [],
            faltanteFilterValue: '',
            faltantes: [],

            
            //TABLA
            selected: [],
            tableHeaders: [
            { text: "Pedido Vtex", value: "trx_usuario7"},
            { text: "Ruc", value: "trx_usuario8"},
            { text: "Estado", value: "etrx_nombre"},
            { text: "Faltante", value: "faltante"},
            { text: "Fecha Trx", value: "trx_fecha"},
            { text: "Cadena", value: "cad_nombre"},
            { text: "Local", value: "loc_nombre"},
            { text: "Pos", value: "trx_pos"},
            { text: "Secuencia", value: "trx_boleta"},
            { text: "Doc Venta", value: "tte_nombre"},
            { text: "Cod. Autor", value: "trx_codautor"},
            { text: "Tipo Venta", value: "emi_nombre"},
            { text: "Importe "+config.symbolMoney, value: "trx_montoFormateado"},
            { text: "N° Tarjeta", value: "trx_numtarjeta"},
            ],
            desserts: [],
            loadTable: false,
            search: "",
        };
    },
    
    computed: {
        // FORMATEAR FECHAS
        computedDateFormatted1() {
            return this.formatDate1(this.startDate);
        },
        computedDateFormatted2() {
            return this.formatDate1(this.endDate);
        },
    },

    async mounted() {
        // CONSUME SERVICIOS
        this.loader = true;
        console.log(this.desserts.length);
        this.cadenas = await getCadenas();
        this.blocales = await getLocales();
        this.estados = await getEstados();
        this.emisores = await getEmisores();
        this.faltantes = await getFaltantes();
        this.loader = false;
    },

    methods: {
        /* FORMATEA FECHAS */
        formatDate1(date) {
            if (!date) return null;
            const [year, month, day] = date.split("-");
            return `${day}/${month}/${year}`;
        },

        /* VALIDA MAXIMO DIAS */
        validaMaximoDias(fechaini, fechater) {
            let fecha1 = new Date(fechaini);
            let fecha2 = new Date(fechater);
            let diferencia = fecha2.getTime() - fecha1.getTime();
            let diasDiferencia = diferencia / 1000 / 60 / 60 / 24;
            if (diasDiferencia > 31) {
                return false;
            } else {
                return true;
            }
        },

        /* VALIDA FECHA TERMINO MAYOR A FECHA INICIO */
        validaFechaFinMayorAFechaInicio(fechaini, fechater) {
            let fecha1 = new Date(fechaini);
            let fecha2 = new Date(fechater);
            if (fecha1 > fecha2) {
                return false;
            } else {
                return true;
            }
        },

        /* SERVICIO OBTIENE LOCALES POR CADENA SELECCIONADA */
        async getLocalesByCadena() {
            this.blocales = [];
            this.localFilterValue = [];
            if (this.cadenaFilterValue == null || this.cadenaFilterValue == "") {
                this.blocales = await getLocales();
            } else {
                this.blocales = await getLocalesByCadena(this.cadenaFilterValue);
            }
        },

        /* SERVICIO OBTIENE OPERADORES POR EMISOR SELECCIONADO */
        async getOperadoresByEmisor() {
            this.operadores = [];
            this.operadorFilterValue = [];
            this.operadores = await getOperadoresByEmisor(this.emisorFilterValue);
        },

        /* SERVICIO OBTIENE DETALLE POR FILTROS */
        async detalleByFiltro() {
            this.desserts = [];

            // VALIDACIONES
            /* VALIDA QUE FECHA INICIO NO SEA MAYOR A FECHA FIN */
            if (!this.validaFechaFinMayorAFechaInicio(this.startDate, this.endDate)) {
                this.showWarnMsg({message: "La fecha de fin del periodo debe ser mayor o igual a la fecha de inicio."});
                return;
            }

            /* VALIDA MAXIMO DE DIAS NO SUPERE A 31 */
            if (!this.validaMaximoDias(this.startDate, this.endDate)) {
                this.showWarnMsg({message: "El rango de fechas no debe ser mayor a 31 días."});
                return;
            }

            if (!this.startDate) {
                this.showWarnMsg({message: "Debe seleccionar una Fecha de Inicio."});
            }
            if (!this.endDate) {
                this.showWarnMsg({message: "Debe seleccionar una Fecha de Término."});
            }
            
            /* OBTENER DETALLE EN BASE A FILTROS */
            if (this.startDate && this.endDate) {
                this.loader = true;
                if (this.startDate == "") {
                    this.startDate = null;
                }
                if (this.endDate == "") {
                    this.endDate = null;
                }
                if (this.cadenaFilterValue == "") {
                    this.cadenaFilterValue = null;
                }
                if (this.localFilterValue == "") {
                    this.localFilterValue = null;
                }
                if (this.emisorFilterValue == "") {
                    this.emisorFilterValue = null;
                }
                if (this.pedidoVtexFilterValue == "") {
                    this.pedidoVtexFilterValue = null;
                }
                if (this.estadoFilterValue == "") {
                    this.estadoFilterValue = null;
                }
                if (this.operadorFilterValue == "") {
                    this.operadorFilterValue = null;
                }
                if (this.faltanteFilterValue == "") {
                    this.faltanteFilterValue = null;
                }
                const filtro = {
                    idusuario: null, // EDITAR CUANDO SE TERMINE PERFILAMIENTO
                    fechainicio: this.startDate,
                    fechatermino: this.endDate,
                    idcadena: this.cadenaFilterValue,
                    idlocal: this.localFilterValue,
                    idemisor: this.emisorFilterValue,
                    pedidovtex: this.pedidoVtexFilterValue,
                    idestado: this.estadoFilterValue,
                    idoperador: this.operadorFilterValue,
                    idfaltante: this.faltanteFilterValue,
                    is_peru_enabled: true,
                    idtipotrx: null,
                    idestadotrx: null,
                    idcomercio: null
                };

                try {
                    const listaPedidosNoConciliados = await getDetalleByFiltro(filtro);
                    this.showInfoMsg({message: "Se encontraron " + listaPedidosNoConciliados.length + " registros."});
                    if (listaPedidosNoConciliados.length != 0) {
                        listaPedidosNoConciliados.forEach((pedido) => {

                            // SETEA COLUMNA 'FALTANTE'
                            let objFaltante = 'Tesoreria';
                            if (pedido.etrx_nombre == 'Pre-litigio') {
                                objFaltante = 'Operador';
                            }
                            pedido.faltante = objFaltante;
                        });

                    this.desserts = listaPedidosNoConciliados;
                    }
                } catch (error) {
                    console.log(error);
                    this.showErrorMsg({message: "Hubo un error al obtener los registros."});
                }

            } else {
                this.showErrorMsg({message: "Por favor complete los campos requeridos."});
            }
            this.loader = false;
        },

        /* EXPORTA REGISTROS DE TABLA A PLANILLA .XLSX */
        exportarPlanilla() {
            this.loader = true;

            try {
                if (this.desserts.length > 0) {
                    let data = this.desserts.map(row => ({
                    'Pedido Vtex': row.trx_usuario7,
                    'Ruc': row.trx_usuario8,
                    'Estado': row.etrx_nombre,
                    'Faltante': row.faltante,
                    'Fecha Trx': row.trx_fecha,
                    'Cadena': row.cad_nombre,
                    'Local': row.loc_nombre,
                    'Pos': row.trx_pos,
                    'Secuencia': row.trx_boleta,
                    'Doc Venta': row.tte_nombre,
                    'Cod. Autor': row.trx_codautor,
                    'Tipo Venta': row.emi_nombre,
                    ['Importe ' + config.symbolMoney]: row.trx_monto,
                    'N tarjeta': row.trx_numtarjeta
                    }));
                    const ws = XLSX.utils.json_to_sheet(data);
                    const wb = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(wb, ws, "Consulta-Pedidos-No-Conciliados");
                    XLSX.writeFile(wb, "consulta-pedidos-no-conciliados.xlsx");
                    this.showSuccessMsg({message: "Se generó la planilla con éxito."});
                } else {
                    this.showWarnMsg({message: "No hay registros para exportar."});
                }
                
            } catch (error) {
                console.log(error);
                this.showErrorMsg({message: "Hubo un error al generar planilla."});
            }
            this.loader = false;
        }
    },

};
</script>

<style>

.v-select__selections {
    max-width: 82.7667px !important;
}

.v-select__selections {
    flex-wrap: nowrap !important;
}

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

.botonExcel {
    color: darkgreen;
}

</style>