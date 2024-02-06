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
        sort-by="detalleemisortransacciones.idemisor"
        item-key="detalleemisortransacciones.idemisor"
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
                    <v-toolbar-title class="rdmqc">Monitor de Conciliación</v-toolbar-title>
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
                                        <v-col cols="12" xs="12" sm="12" md="6" lg="4" xl="4">
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
                                        <v-col cols="12" xs="12" sm="12" md="6" lg="4" xl="4">
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
                                        <v-col cols="12" xs="12" sm="12" md="6" lg="4" xl="4">
                                            <v-autocomplete
                                            label="Cadenas"
                                            class="font-class-name1"
                                            v-model="cadenaFilterValue"
                                            :items="cadenas"
                                            item-text="cadNombre"
                                            item-value="idCadena"
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

            <!-- TEMPLATE PARA COLUMNA NO LIQUIDADAS TOTAL -->
            <template v-slot:[`item.colNoLiquidadasTotal`]="{ item }">
                <div v-if="item.trx_no_liq_cant > 0">
                    <span>Trx: {{ item.trx_no_liq_cant }}</span>
                    <br>
                    <span>{{ item.trx_no_liq_monto.toFixed(2) }}</span>
                </div>
                
            </template>

            <!-- TEMPLATE PARA COLUMNA RECIBIDA -->
            <template v-slot:[`item.colRecibida`]="{ item }">
                <div v-if="item.trx_recibida_cant > 0">
                    <!-- <a href=""> -->
                        <span>Trx: {{ item.trx_recibida_cant }}</span>
                        <br>
                        <span>{{ item.trx_recibida_monto.toFixed(2) }}</span>
                    <!-- </a> -->
                    
                </div>
                
            </template>

            <!-- TEMPLATE PARA COLUMNA CONCILIADA -->
            <template v-slot:[`item.colConciliada`]="{ item }">
                <div v-if="item.trx_conciliada_cant > 0">
                    <!-- <a href=""> -->
                        <span>Trx: {{ item.trx_conciliada_cant }}</span>
                        <br>
                        <span>{{ item.trx_conciliada_monto.toFixed(2) }}</span>
                    <!-- </a> -->
                </div>
                
            </template>

            <!-- TEMPLATE PARA COLUMNA PENDIENTE -->
            <template v-slot:[`item.colPendiente`]="{ item }">
                <div v-if="item.trx_pendiente_cant > 0">
                    <!-- <a href=""> -->
                        <span>Trx: {{ item.trx_pendiente_cant }}</span>
                        <br>
                        <span>{{ item.trx_pendiente_monto.toFixed(2) }}</span>
                    <!-- </a> -->
                </div>
                
            </template>

            <!-- TEMPLATE PARA COLUMNA PRELITIGIO -->
            <template v-slot:[`item.colPrelitigio`]="{ item }">
                <div v-if="item.trx_prelitigio_cant > 0">
                    <!-- <a v-bind:href="'/#/CyL/conccoavtran?param1=true'"> -->
                        <span>Trx: {{ item.trx_prelitigio_cant }}</span>
                        <br>
                        <span>{{ item.trx_prelitigio_monto.toFixed(2) }}</span>
                    <!-- </a> -->
                </div>
                
            </template>

            <!-- TEMPLATE PARA COLUMNA LITIGIO -->
            <template v-slot:[`item.colLitigio`]="{ item }">
                <div v-if="item.trx_litigio_cant > 0">
                    <!-- <a href=""> -->
                        <span>Trx: {{ item.trx_litigio_cant }}</span>
                        <br>
                        <span>{{ item.trx_litigio_monto.toFixed(2) }}</span>
                    <!-- </a> -->
                </div>
                
            </template>

            <!-- TEMPLATE PARA COLUMNA DESCONOCIDA -->
            <template v-slot:[`item.colDesconocida`]="{ item }">
                <div v-if="item.trx_desconocida_cant > 0">
                    <!-- <a href=""> -->
                        <span>Trx: {{ item.trx_desconocida_cant }}</span>
                        <br>
                        <span>{{ item.trx_desconocida_monto.toFixed(2) }}</span>
                    <!-- </a> -->
                </div>
                
            </template>

            <!-- TEMPLATE PARA COLUMNA ARCHIVO -->
            <template v-slot:[`item.colArchivos`]="{ item }">
                <div>
                    <span>{{ item.ult_arch_conc }}</span>
                    <br>
                    <span>{{ item.ult_arch_liq }}</span>
                </div>
                
            </template>

            <template v-slot:no-data>
                <span>No hay registros</span>
            </template>
            <template v-if="this.desserts.length > 0" v-slot:foot>
                <v-spacer></v-spacer>
                <!-- TOTALES DE DETALLE -->
                <tr class="border-top border-primary border-bottom border-primary">
                    <th class="pl-4">TOTALES:</th>
                    <th v-if="totalNoLiquidadasTotalCantidad > 0" class="pl-4">Trx: {{ totalNoLiquidadasTotalCantidad }}<br>{{ totalNoLiquidadasTotalMonto.toFixed(2) }}</th>
                    <th v-else class="pl-4"></th>
                    <th v-if="totalRecibidaCantidad > 0" class="pl-4">Trx: {{ totalRecibidaCantidad }}<br>{{ totalRecibidaMonto.toFixed(2) }}</th>
                    <th v-else class="pl-4"></th>
                    <th v-if="totalConciliadaCantidad > 0" class="pl-4">Trx: {{ totalConciliadaCantidad }}<br>{{ totalConciliadaMonto.toFixed(2) }}</th>
                    <th v-else class="pl-4"></th>
                    <th v-if="totalPendienteCantidad > 0" class="pl-4">Trx: {{ totalPendienteCantidad }}<br>{{ totalPendienteMonto.toFixed(2) }}</th>
                    <th v-else class="pl-4"></th>
                    <th v-if="totalPrelitigioCantidad > 0" class="pl-4">Trx: {{ totalPrelitigioCantidad }}<br>{{ totalPrelitigioMonto.toFixed(2) }}</th>
                    <th v-else class="pl-4"></th>
                    <th v-if="totalLitigioCantidad > 0" class="pl-4">Trx: {{ totalLitigioCantidad }}<br>{{ totalLitigioMonto.toFixed(2) }}</th>
                    <th v-else class="pl-4"></th>
                    <th v-if="totalDesconocidaCantidad > 0" class="pl-4">Trx: {{ totalDesconocidaCantidad }}<br>{{ totalDesconocidaMonto.toFixed(2) }}</th>
                    <th v-else class="pl-4"></th>
                    <!-- <th class="pl-4">{{ objEstadisticas.totaltrxrecibidas }}</th>
                    <th class="pl-4">{{ objEstadisticas.totalmontotrx }}</th> -->
                </tr>
            </template>
        </v-data-table>
    </div>
</template>
<script>

import { getCadenas, getDetalleByFiltro } from '../services/ConcmonconcService';
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
            //TABLA
            selected: [],
            tableHeaders: [
            { text: "EMISOR", value: "nom_emisor"},
            { text: "No Liquidadas Total ("+config.symbolMoney+") 	", value: "colNoLiquidadasTotal"},
            { text: "Recibida ("+config.symbolMoney+")", value: "colRecibida"},
            { text: "Conciliada ("+config.symbolMoney+")", value: "colConciliada"},
            { text: "Pendiente ("+config.symbolMoney+")", value: "colPendiente"},
            { text: "Pre Litigio ("+config.symbolMoney+")", value: "colPrelitigio"},
            { text: "Litigio ("+config.symbolMoney+")", value: "colLitigio"},
            { text: "Desconocida ("+config.symbolMoney+")", value: "colDesconocida"},
            { text: "Log de Carga de Archivos", value: "colArchivos"},
            ],
            objEstadisticas: {
                totaltrxrecibidas: "",
                totalmontotrx: ""
            },
            totalNoLiquidadasTotalMonto: 0,
            totalNoLiquidadasTotalCantidad: 0,
            totalRecibidaMonto: 0,
            totalRecibidaCantidad: 0,
            totalConciliadaMonto: 0,
            totalConciliadaCantidad: 0,
            totalPendienteMonto: 0,
            totalPendienteCantidad: 0,
            totalPrelitigioMonto: 0,
            totalPrelitigioCantidad: 0,
            totalLitigioMonto: 0,
            totalLitigioCantidad: 0,
            totalDesconocidaMonto: 0,
            totalDesconocidaCantidad: 0,
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

        /* RESETEA TOTALES */
        reseteaTotales() {
            this.totalNoLiquidadasTotalMonto = 0;
            this.totalNoLiquidadasTotalCantidad = 0;
            this.totalRecibidaMonto = 0;
            this.totalRecibidaCantidad = 0;
            this.totalConciliadaMonto = 0;
            this.totalConciliadaCantidad = 0;
            this.totalPendienteMonto = 0;
            this.totalPendienteCantidad = 0;
            this.totalPrelitigioMonto = 0;
            this.totalPrelitigioCantidad = 0;
            this.totalLitigioMonto = 0;
            this.totalLitigioCantidad = 0;
            this.totalDesconocidaMonto = 0;
            this.totalDesconocidaCantidad = 0;
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

                const filtro = {
                    id_usuario: null, // EDITAR CUANDO SE TERMINE PERFILAMIENTO
                    f_ini: this.startDate,
                    f_fin: this.endDate,
                    id_comercio: null,
                    id_emisor: null,
                    idcadena: this.cadenaFilterValue
                };

                try {
                    /* const estadisticas = await getDetalleByFiltro(filtro);
                    this.showInfoMsg({message: "Se encontraron " + estadisticas.detalleemisortransacciones.length + " registros."});
                    if (estadisticas.detalleemisortransacciones.length != 0) {
                        this.objEstadisticas.totaltrxrecibidas = estadisticas.totaltrxrecibidas;
                        this.objEstadisticas.totalmontotrx = estadisticas.totalmontotrx;
                        console.log(this.objEstadisticas);
                        estadisticas.detalleemisortransacciones.forEach((detalleTrx) => {
                        this.desserts.push(detalleTrx);
                    });
                    } */
                    this.reseteaTotales();
                    const detalleMonitorDeConciliacion = await getDetalleByFiltro(filtro);
                    this.showInfoMsg({message: "Se encontraron " + detalleMonitorDeConciliacion.length + " registros."});
                    if (detalleMonitorDeConciliacion.length != 0) {

                        detalleMonitorDeConciliacion.forEach((objMonitorDeConciliacion) => {

                            this.totalNoLiquidadasTotalMonto = this.totalNoLiquidadasTotalMonto + objMonitorDeConciliacion.trx_no_liq_monto;
                            this.totalNoLiquidadasTotalCantidad = this.totalNoLiquidadasTotalCantidad + objMonitorDeConciliacion.trx_no_liq_cant;
                            this.totalRecibidaMonto = this.totalRecibidaMonto + objMonitorDeConciliacion.trx_recibida_monto;
                            this.totalRecibidaCantidad = this.totalRecibidaCantidad + objMonitorDeConciliacion.trx_recibida_cant;
                            this.totalConciliadaMonto = this.totalConciliadaMonto + objMonitorDeConciliacion.trx_conciliada_monto;
                            this.totalConciliadaCantidad = this.totalConciliadaCantidad + objMonitorDeConciliacion.trx_conciliada_cant;
                            this.totalPendienteMonto = this.totalPendienteMonto + objMonitorDeConciliacion.trx_pendiente_monto;
                            this.totalPendienteCantidad = this.totalPendienteCantidad + objMonitorDeConciliacion.trx_pendiente_cant;
                            this.totalPrelitigioMonto = this.totalPrelitigioMonto + objMonitorDeConciliacion.trx_prelitigio_monto;
                            this.totalPrelitigioCantidad = this.totalPrelitigioCantidad + objMonitorDeConciliacion.trx_prelitigio_cant;
                            this.totalLitigioMonto = this.totalLitigioMonto + objMonitorDeConciliacion.trx_litigio_monto;
                            this.totalLitigioCantidad = this.totalLitigioCantidad + objMonitorDeConciliacion.trx_litigio_cant;
                            this.totalDesconocidaMonto = this.totalDesconocidaMonto + objMonitorDeConciliacion.trx_desconocida_monto;
                            this.totalDesconocidaCantidad = this.totalDesconocidaCantidad + objMonitorDeConciliacion.trx_desconocida_cant;

                            this.desserts.push(objMonitorDeConciliacion);
                    });
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
                    'Emisor': row.nom_emisor,
                    'No Liquidadas Total (Cant)': row.trx_no_liq_cant,
                    ['No Liquidadas Total ' + config.symbolMoney]: row.trx_no_liq_monto.toFixed(2),
                    'Recibida (Cant)': row.trx_recibida_cant,
                    ['Recibida ' + config.symbolMoney]: row.trx_recibida_monto.toFixed(2),
                    'Conciliada (Cant)': row.trx_conciliada_cant,
                    ['Conciliada ' + config.symbolMoney]: row.trx_conciliada_monto.toFixed(2),
                    'Pendiente (Cant)': row.trx_pendiente_cant,
                    ['Pendiente ' + config.symbolMoney]: row.trx_pendiente_monto.toFixed(2),
                    'Pre Litigio (Cant)': row.trx_prelitigio_cant,
                    ['Pre Litigio ' + config.symbolMoney]: row.trx_prelitigio_monto.toFixed(2),
                    'Litigio (Cant)': row.trx_litigio_cant,
                    ['Litigio ' + config.symbolMoney]: row.trx_litigio_monto.toFixed(2),
                    'Desconocida (Cant)': row.trx_desconocida_cant,
                    ['Desconocida ' + config.symbolMoney]: row.trx_desconocida_monto.toFixed(2),
                    'Ultimo Archivo Conciliación': row.ult_arch_conc,
                    'Ultimo Archivo Liquidación': row.ult_arch_liq,
                    }));

                    const ws = XLSX.utils.json_to_sheet(data);
                    const wb = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(wb, ws, "Consulta-Estadisticas-Generales");
                    XLSX.writeFile(wb, "consulta-estadisticas-generales.xlsx");
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