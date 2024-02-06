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
                    <v-toolbar-title class="rdmqc">Informe de Comisiones - Tarjeta OH!</v-toolbar-title>
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
                                            multiple         
                                            ></v-autocomplete>
                                        </v-col>

                                        <!-- TIPO DE REPORTE -->
                                        <v-col cols="12" xs="12" sm="12" md="6" lg="3" xl="3">
                                            <v-autocomplete
                                            label="Tipo De Reporte"
                                            class="font-class-name1 custom-autocomplete"
                                            v-model="tipodereporteFilterValue"
                                            :items="tiposdereporte"
                                            item-text="nombre"
                                            item-value="codigo"
                                            clearable        
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

/* eslint-disable no-unused-vars */
import { getCadenas, getLocales, getLocalesByCadena, getTipoDeReporte, getDetalleByFiltro } from '../services/InfotarohService';
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
            tipodereporteFilterValue: '',
            tiposdereporte:[],
            detalleTransaccionesFilterValue: false,
            //TABLA
            selected: [],
            tableHeaders : [
                { text: "Fecha Trx", value: "trx_fecha_formateada"},
                { text: "Centro de Costo", value: "loc_codsap"},
                { text: "Código Local", value: "loc_codigo"},
                { text: "Local", value: "loc_nombre"},
                { text: "Tipo", value: "tipo"},
                { text: "POS", value: "pos"},
                { text: "N° Trx", value: "numerotrx"},
                { text: "Cajero", value: "vendedor"},
                { text: "Nº Tarjeta / Suministro", value: "comprobante"},
                { text: "Monto Trx "+config.symbolMoney, value: "montoFormateado"},
                { text: "Comisión Comercio "+config.symbolMoney, value: "comisiontotalFormateado"},
                { text: "Comisión Comercio Bruto "+config.symbolMoney, value: "comisionbrutoFormateado"},
                { text: "Neto Comercio "+config.symbolMoney, value: "netocomercioFormateado"}
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
        this.cadenas = await getCadenas();
        this.blocales = await getLocales();
        this.tiposdereporte = await getTipoDeReporte();
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
                if (this.tipodereporteFilterValue == "") {
                    this.tipodereporteFilterValue = null;
                }

                let codigo = null;
                let emi_codigo = null;
                let tipo_reporte = null;
                let codigodos = null;

                if (this.tipodereporteFilterValue != null) {

                    if (this.tipodereporteFilterValue == 64 || this.tipodereporteFilterValue == 65) {
                        codigo = this.tipodereporteFilterValue;
                        tipo_reporte = 1;
                    }

                    if (this.tipodereporteFilterValue == 60) {
                        codigo = this.tipodereporteFilterValue;
                        codigodos = 1;
                        emi_codigo = "2";
                        tipo_reporte = 2;
                    }

                    if (this.tipodereporteFilterValue == 61) {
                        codigo = this.tipodereporteFilterValue;
                        emi_codigo = "2";
                        tipo_reporte = 2;
                    }
                    
                } else {
                    codigo = 60;
                    emi_codigo = "2";
                }

                const filtro = {
                    id_usuario: null, // EDITAR CUANDO SE TERMINE PERFILAMIENTO
                    fechainicio: this.startDate,
                    fechatermino: this.endDate,
                    id_cadena: this.cadenaFilterValue,
                    locales: this.localFilterValue,
                    codigo: codigo,
                    tipo_reporte: tipo_reporte,
                    emi_codigo: emi_codigo,
                    codigodos: codigodos
                };

                try {
                    const listaConsultaTransacciones = await getDetalleByFiltro(filtro);
                        this.showInfoMsg({message: "Se encontraron " + listaConsultaTransacciones.length + " registros."});
                        if (listaConsultaTransacciones.length != 0) {
                            listaConsultaTransacciones.forEach((objConsultaTransacciones) => {

                                if (objConsultaTransacciones.idemisor == 8) {
                                    objConsultaTransacciones.tipo = "Pago a Cuenta Oh MC";
                                } 
                                else if (objConsultaTransacciones.idemisor == 11) {
                                    objConsultaTransacciones.tipo = "Pago a Cuenta Oh VISA";
                                }
                                else if (objConsultaTransacciones.codigo == "2" || objConsultaTransacciones.codigo == "82" || objConsultaTransacciones.codigo == "60") {
                                    objConsultaTransacciones.tipo = "Disposicion de Efectivo MC";
                                }
                                else if (objConsultaTransacciones.codigo == "1" || objConsultaTransacciones.codigo == "61") {
                                    objConsultaTransacciones.tipo = "Disposicion de Efectivo VISA";
                                } else {
                                    objConsultaTransacciones.tipo = "No Identificado";
                                }

                                objConsultaTransacciones.trx_fecha_formateada = objConsultaTransacciones.fecha + " " + objConsultaTransacciones.hora;
                                this.desserts.push(objConsultaTransacciones);
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
                console.log(this.desserts);
                console.log(this.desserts.length);
                if (this.desserts.length > 0) {
                    let data = [];
                    data = this.desserts.map(row => ({
                        'Fecha Trx': row.fecha,
                        'Hora': row.hora,
                        'Centro de Costo': row.loc_codsap,
                        'Código Local': row.loc_codigo,
                        'Local': row.loc_nombre,
                        'Tipo': row.tipo,
                        'POS': row.pos,
                        'N° Trx': row.numerotrx,
                        'Cajero': row.vendedor,
                        'Nº Tarjeta / Suministro': row.comprobante,
                        ['Monto Trx ' + config.symbolMoney]: row.montoFormateado,
                        ['Comisión Comercio ' + config.symbolMoney]: row.comisiontotalFormateado,
                        ['Comisión Comercio Bruto ' + config.symbolMoney]: row.comisionbrutoFormateado,
                        ['Neto Comercio ' + config.symbolMoney]: row.netocomercioFormateado,
                        }));

                    const ws = XLSX.utils.json_to_sheet(data);
                    const wb = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(wb, ws, "Informe-Tarjeta-OH");
                    XLSX.writeFile(wb, "informe-tarjeta-oh.xlsx");
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