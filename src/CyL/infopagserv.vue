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
                    <v-toolbar-title class="rdmqc">Informe de Comisiones - Pago De Servicios</v-toolbar-title>
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
                                            @change="getTipoTrxByEmisor"
                                            ></v-autocomplete>
                                        </v-col>
                                        
                                    </v-row>

                                    <v-row>

                                        <!-- TIPO TRX -->
                                        <v-col cols="12" xs="12" sm="12" md="6" lg="3" xl="3">
                                            <v-autocomplete
                                            label="Tipo Trx"
                                            class="font-class-name1 custom-autocomplete"
                                            v-model="tipotrxFilterValue"
                                            :items="tiposTrx"
                                            item-text="tteNombre"
                                            item-value="idTipotrx"
                                            clearable                       
                                            ></v-autocomplete>
                                        </v-col>

                                        <!-- CONCILIACIÓN -->
                                        <v-col cols="12" xs="12" sm="12" md="6" lg="3" xl="3">
                                            <v-autocomplete
                                            label="Conciliación"
                                            class="font-class-name1 custom-autocomplete"
                                            v-model="estadoConciliacionFilterValue"
                                            :items="estadosConciliacion"
                                            item-text="ecnDescripcion"
                                            item-value="ecnEstadoCon"
                                            clearable
                                            multiple         
                                            ></v-autocomplete>
                                        </v-col>

                                        <!-- LIQUIDACIÓN -->
                                        <v-col cols="12" xs="12" sm="12" md="6" lg="3" xl="3">
                                            <v-autocomplete
                                            label="Liquidación"
                                            class="font-class-name1 custom-autocomplete"
                                            v-model="estadoLiquidacionFilterValue"
                                            :items="estadosLiquidacion"
                                            item-text="eliDescripcion"
                                            item-value="eliEstadoLiq"
                                            clearable
                                            multiple         
                                            ></v-autocomplete>
                                        </v-col>

                                        <!-- DETALLE -->
                                        <v-col cols="12" xs="12" sm="12" md="6" lg="3" xl="3">
                                            <v-switch v-model="detalleTransaccionesFilterValue" label="Detalle de transacciones"
                                             color="info" value="info" hide-details @change="seteaHeaders"></v-switch>
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
            <template v-if="this.desserts.length > 0 && this.detalleTransaccionesFilterValue" v-slot:foot>
                <v-spacer></v-spacer>
                <!-- TOTALES DE DETALLE -->
                <tr class="border-top border-primary border-bottom border-primary">
                    <th class="pl-4">TOTALES:</th>
                    <th class="pl-4"></th>
                    <th class="pl-4"></th>
                    <th class="pl-4"></th>
                    <th class="pl-4"></th>
                    <th class="pl-4"></th>
                    <th class="pl-4">{{ objTotalesPagoDeServicios.totalcantidad }}</th>
                    <th class="pl-4">{{ objTotalesPagoDeServicios.totalmontoFormateado }}</th>
                    <th class="pl-4">{{ objTotalesPagoDeServicios.totalcomisionFormateado }}</th>
                    <th class="pl-4">{{ objTotalesPagoDeServicios.totalnetoFormateado }}</th>
                </tr>
            </template>
        </v-data-table>
    </div>
</template>
<script>

/* eslint-disable no-unused-vars */
import { getCadenas, getLocales, getLocalesByCadena, getEmisores, 
    getTipoTrxByEmisor, getEstadoConciliaciones, getEstadoLiquidaciones,
    getTotalPagosByFiltro, getDetalleByFiltro } from '../services/InfopagservService';
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
            emisorFilterValue: '',
            emisores: [],
            tipotrxFilterValue: '',
            tiposTrx: [],
            estadoConciliacionFilterValue: '',
            estadosConciliacion: [],
            estadoLiquidacionFilterValue: '',
            estadosLiquidacion: [],
            detalleTransaccionesFilterValue: false,
            //TABLA
            selected: [],
            tableHeaders : [
                { text: "Cantidad", value: "totalcantidad"},
                { text: "Monto "+config.symbolMoney, value: "totalmontoFormateado"},
                { text: "Comision "+config.symbolMoney, value: "totalcomisionFormateado"},
                { text: "Neto "+config.symbolMoney, value: "totalnetoFormateado"}
            ],
            objTotalesPagoDeServicios: {
                totalcantidad: "",
                totalmonto: "",
                totalcomision: "",
                totalneto: "",
            },
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
        this.cadenas = await getCadenas();
        this.blocales = await getLocales();
        this.emisores = await getEmisores();
        this.estadosConciliacion = await getEstadoConciliaciones();
        this.estadosLiquidacion = await getEstadoLiquidaciones();
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

        /* SERVICIO OBTIENE TIPOS DE TRX POR EMISOR SELECCIONADO */
        async getTipoTrxByEmisor() {
            this.tiposTrx = [];
            this.tipotrxFilterValue = [];
            this.tiposTrx = await getTipoTrxByEmisor(this.emisorFilterValue);
        },

        /* SERVICIO SETEA HEADERS SI SELECCIONA DETALLE */
        async seteaHeaders() {
            this.tableHeaders = [];
            this.desserts = [];
            if (this.detalleTransaccionesFilterValue) {
                this.tableHeaders = [
                    { text: "Cadena", value: "cad_nombre"},
                    { text: "Local", value: "loc_nombre"},
                    { text: "Emisor", value: "emi_nombre"},
                    { text: "Fecha", value: "trx_fecha"},
                    { text: "Pos", value: "trx_pos"},
                    { text: "Comprobante", value: "trx_comprobante"},
                    { text: "Cantidad", value: "cantidad"},
                    { text: "Monto "+config.symbolMoney, value: "trx_montoFormateado"},
                    { text: "Comision "+config.symbolMoney, value: "monto_comisionFormateado"},
                    { text: "Neto "+config.symbolMoney, value: "monto_netoFormateado"}
                ];
            } else {
                this.tableHeaders = [
                    { text: "Cantidad", value: "totalcantidad"},
                    { text: "Monto "+config.symbolMoney, value: "totalmontoFormateado"},
                    { text: "Comision "+config.symbolMoney, value: "totalcomisionFormateado"},
                    { text: "Neto "+config.symbolMoney, value: "totalnetoFormateado"}
                ];
            }
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
                if (this.tipotrxFilterValue == "") {
                    this.tipotrxFilterValue = null;
                }
                if (this.estadoConciliacionFilterValue == "") {
                    this.estadoConciliacionFilterValue = null;
                }
                if (this.estadoLiquidacionFilterValue == "") {
                    this.estadoLiquidacionFilterValue = null;
                }

                const filtro = {
                    idusuario: null, // EDITAR CUANDO SE TERMINE PERFILAMIENTO
                    fechainicio: this.startDate,
                    fechatermino: this.endDate,
                    idcadena: this.cadenaFilterValue,
                    idlocal: this.localFilterValue,
                    idemisor: this.emisorFilterValue,
                    trxfecha: null,
                    idtipotrx: this.tipotrxFilterValue,
                    idestadocon: this.estadoConciliacionFilterValue,
                    idestadoliq: this.estadoLiquidacionFilterValue,
                };

                try {
                    // SI SE SELECCIONA DETALLE DE TRANSACCIONES
                    if (this.detalleTransaccionesFilterValue) {
                        const pagodeservicios = await getDetalleByFiltro(filtro);
                        this.showInfoMsg({message: "Se encontraron " + pagodeservicios.detallepagodeservicios.length + " registros."});
                        if (pagodeservicios.detallepagodeservicios.length != 0) {
                            this.objTotalesPagoDeServicios.totalcantidad = pagodeservicios.totalcantidad;
                            this.objTotalesPagoDeServicios.totalmontoFormateado = pagodeservicios.totalmontoFormateado;
                            this.objTotalesPagoDeServicios.totalcomisionFormateado = pagodeservicios.totalcomisionFormateado;
                            this.objTotalesPagoDeServicios.totalnetoFormateado = pagodeservicios.totalnetoFormateado;
                            pagodeservicios.detallepagodeservicios.forEach((objdetallepagoservicios) => {
                                this.desserts.push(objdetallepagoservicios);
                            });
                        }
                    } else {
                        // SI NO SELECCIONA DETALLE DE TRANSACCIONES
                        let listPagodeServicios = [];
                        const pagodeservicios = await getTotalPagosByFiltro(filtro);
                        if (pagodeservicios) {
                            listPagodeServicios.push(pagodeservicios);
                            listPagodeServicios.forEach((objdetallepagoservicios) => {
                                this.desserts.push(objdetallepagoservicios);
                            });
                        }
                        this.showInfoMsg({message: "Se encontraron " + listPagodeServicios.length + " registros."});
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
                console.log(this.desserts);
                console.log(this.desserts.length);
                if (this.desserts.length > 0) {
                    let data = [];
                    if (this.detalleTransaccionesFilterValue) {
                        data = this.desserts.map(row => ({
                        'Cadena': row.cad_nombre,
                        'Local': row.loc_nombre,
                        'Emisor': row.emi_nombre,
                        'Fecha': row.trx_fecha,
                        'Pos': row.trx_pos,
                        'Comprobante': row.trx_comprobante,
                        'Cantidad': row.cantidad,
                        ['Monto ' + config.symbolMoney]: row.trx_montoFormateado,
                        ['Comision ' + config.symbolMoney]: row.monto_comisionFormateado,
                        ['Neto ' + config.symbolMoney]: row.monto_netoFormateado,
                        }));
                        data.push({
                            'Comprobante': 'Totales:',
                            'Cantidad': this.objTotalesPagoDeServicios.totalcantidad,
                            ['Monto ' + config.symbolMoney]: this.objTotalesPagoDeServicios.totalmontoFormateado,
                            ['Comision ' + config.symbolMoney]: this.objTotalesPagoDeServicios.totalcomisionFormateado,
                            ['Neto ' + config.symbolMoney]: this.objTotalesPagoDeServicios.totalnetoFormateado,
                        });
                    } else {
                        data = this.desserts.map(row => ({
                            'Cantidad': row.totalcantidad,
                            ['Monto ' + config.symbolMoney]: row.totalmontoFormateado,
                            ['Comision ' + config.symbolMoney]: row.totalcomisionFormateado,
                            ['Neto ' + config.symbolMoney]: row.totalnetoFormateado,
                        }));
                    }
                    const ws = XLSX.utils.json_to_sheet(data);
                    const wb = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(wb, ws, "Informe-Pago-de-servicios");
                    XLSX.writeFile(wb, "informe-pago-de-servicios.xlsx");
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