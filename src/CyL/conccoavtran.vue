<template>
    <div>
        <!-- LOADER -->
        <VueElementLoading :active="loader" spinner="bar-fade-scale" color="var(--primary)"/>

        <!-- DIALOG DE HISTORIAL DE ANOTACIONES INGRESADAS -->
        <v-dialog v-model="dialogAnotaciones" scrollable>
            <!-- CONFIGURACIÓN TABLA ANOTACIONES-->
            <v-data-table 
            v-model="selectedAnotacion"
            :headers="tableHeadersAnotacion"
            :items="dessertsAnotacion"
            :loading="loadTableAnotacion"
            loading-text="Cargando Anotaciones..."
            :items-per-page="10"
            class="row-height1-30 elevation-1"
            :footer-props="{
            'items-per-page-text':'Registros por página',
            'pageText': '{0}-{1} de {2}'
            }"
            >
            <template v-slot:top>
                <v-toolbar flat color="white">
                    <v-toolbar-title class="rdmqc">Historial de anotaciones ingresadas</v-toolbar-title>
                </v-toolbar>
            </template>
            <template v-slot:no-data>
                <span>No hay registros</span>
            </template>
            </v-data-table>
        </v-dialog>

        <!-- DIALOG DE HISTORIAL DE CAMBIO DE ESTADOS -->
        <v-dialog v-model="dialogCambioEstado" scrollable>
            <!-- CONFIGURACIÓN TABLA CAMBIO DE ESTADOS-->
            <v-data-table 
            v-model="selectedCambioEstado"
            :headers="tableHeadersCambioEstado"
            :items="dessertsCambioEstado"
            :loading="loadTableCambioEstado"
            loading-text="Cargando CambioEstado..."
            :items-per-page="10"
            class="row-height1-30 elevation-1"
            :footer-props="{
            'items-per-page-text':'Registros por página',
            'pageText': '{0}-{1} de {2}'
            }"
            >
            <template v-slot:top>
                <v-toolbar flat color="white">
                    <v-toolbar-title class="rdmqc">Historial de Cambio de Estados</v-toolbar-title>
                </v-toolbar>
            </template>
            <template v-slot:no-data>
                <span>No hay registros</span>
            </template>
            </v-data-table>
        </v-dialog>

        <!-- DIALOG DE REGISTRO DE ANOTACIONES -->
        <v-dialog v-model="dialogRegistroAnotaciones" scrollable>
            <!-- CONFIGURACIÓN TABLA ANOTACIONES-->
            <div class="main-card mb-3 card">
              <div class="card-header rdmqc">Registro de Anotaciones</div>
              <div class="card-body scrollable-card-body">
                <!-- LOADER -->
                <VueElementLoading :active="loaderDialog" spinner="bar-fade-scale" color="var(--primary)"/>
                <p class="mb-0"><em>Selecciona un estado; Revisa la información de las trx; Ingresa una anotación y luego presiona botón...</em></p>
                <v-container class="m-0 p-0">
                    <v-row>

                        <!-- NUEVO ESTADO CONCILIACION -->
                        <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6">
                            <v-autocomplete
                                label="Seleccione nuevo estado Conciliación"
                                class="font-class-name1"
                                v-model="nuevoEstadoConciliacionFilterValue"
                                :items="nuevoEstadoConciliacion"
                                item-text="ecndescripcion"
                                item-value="ecnestado"
                                clearable
                                Dense                
                                ></v-autocomplete>
                        </v-col>
                    </v-row>
                </v-container>
                <hr/>
                <p><b><u>Información de las transacciones</u></b></p>
                <v-container class="m-0 p-0">
                    <v-row>

                        <!-- TOTAL TRX -->
                        <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6">
                            <v-text-field
                            :readonly="true"
                            v-model="totalTrxFilterValue"
                            label="Total Trx"></v-text-field>
                        </v-col>

                        <!-- MONTO TOTAL -->
                        <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6">
                            <v-text-field
                            :readonly="true"
                            v-model="montoTotalFilterValue"
                            label="Monto Total"></v-text-field>
                        </v-col>
                    </v-row>
                </v-container>
                <hr/>
                <v-container class="m-0 p-0">
                    <v-row>

                        <!-- INPUT INGRESO ANOTACIÓN -->
                        <v-col cols="12" xs="12" sm="12" md="12" lg="12" xl="12">
                            <v-textarea
                            :maxlength="600"
                            v-model="anotacionFilterValue"
                            rows="2"
                            outlined 
                            name="input-7-4" 
                            label="Ingresa una anotación">
                            </v-textarea>
                        </v-col>
                    </v-row>
                </v-container>
              </div>
              <div class="d-block text-right card-footer">
                <button class="mr-2 btn btn-link btn-sm" @click="cerrarDialogAnotaciones">Volver</button>
                <b-button class="btn-sm btn-icon" variant="success" @click="registrarCambioEstadoAnotacion()">
                    <i class="pe-7s-pen btn-icon-wrapper"></i>Registrar Anotación
                </b-button>
              </div>
            </div>
        </v-dialog>

        <!-- CONFIGURACIÓN TABLA -->
        <v-data-table 
        v-model="selected"
        :headers="tableHeaders"
        :items="desserts"
        show-select
        :loading="loadTable"
        loading-text="Cargando Transacciones..."
        :search="search"
        :single-select="singleSelect"
        sort-by="id_trx" 
        item-key="id_trx"  
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
                    <v-toolbar-title class="rdmqc">Consulta de Transacciones Medios de Pago</v-toolbar-title>
                </v-toolbar>

                <!-- EXPANDER PARA FILTROS -->
                <v-expansion-panels class="pb-3">
                    <!-- FILTROS CONSULTA DE TRANSACCIONES -->
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
                                            @change="getOperadoresByEmisor(); getTarjetasByEmisor(); getTipoTrxByEmisor()"
                                            ></v-autocomplete>
                                        </v-col>
                                        
                                    </v-row>

                                    <v-row>

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

                                        <!-- TARJETAS -->
                                        <v-col cols="12" xs="12" sm="12" md="6" lg="3" xl="3">
                                            <v-autocomplete
                                            label="Tarjetas"
                                            class="font-class-name1"
                                            v-model="tarjetaFilterValue"
                                            :items="tarjetas"
                                            item-text="tarNombre"
                                            item-value="idTarjeta"
                                            clearable
                                            Dense                
                                            ></v-autocomplete>
                                        </v-col>

                                        <!-- TIPO TRX -->
                                        <v-col cols="12" xs="12" sm="12" md="6" lg="2" xl="2">
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
                                        <v-col cols="12" xs="12" sm="12" md="6" lg="2" xl="2">
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
                                        <v-col cols="12" xs="12" sm="12" md="6" lg="2" xl="2">
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
                                    </v-row>

                                    <!--BOTONES-->
                                    <v-row>
                                        <v-spacer></v-spacer>

                                        <!-- GENERAR DETALLE -->
                                        <v-col cols="12" xs="12" sm="12" md="6" lg="2" xl="2">
                                            <b-button class="btn-sm btn-icon w-100" variant="primary" @click="detalleByFiltro(true)">
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
                    <!-- FILTROS CONSULTA AVANZADA DE TRANSACCIONES -->
                    <v-expansion-panel>
                        <v-expansion-panel-header><i class="pe-7s-edit"> Filtros Avanzados</i></v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <v-container>

                                    <!--INPUTS-->
                                    <v-row>

                                        <!-- FECHA INICIO -->
                                        <v-col cols="12" xs="12" sm="12" md="6" lg="2" xl="2">
                                            <v-menu
                                            v-model="menu1Adv"
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
                                                        @click:clear="startDateAdv = null"
                                                    ></v-text-field>
                                                </template>
                                                <v-date-picker
                                                v-model="startDateAdv"
                                                @input="menu1Adv = false"
                                                ></v-date-picker>
                                            </v-menu>
                                        </v-col>
                                        
                                        <!-- FECHA TERMINO -->
                                        <v-col cols="12" xs="12" sm="12" md="6" lg="2" xl="2">
                                            <v-menu
                                            v-model="menu2Adv"
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
                                                    @click:clear="endDateAdv = null"
                                                ></v-text-field>
                                            </template>
                                            <v-date-picker
                                            v-model="endDateAdv"
                                            @input="menu2Adv = false"
                                            ></v-date-picker>
                                            </v-menu>
                                        </v-col>

                                        <!-- EMISORES -->
                                        <v-col cols="12" xs="12" sm="12" md="6" lg="3" xl="3">
                                            <v-autocomplete
                                            label="Emisores"
                                            class="font-class-name1 custom-autocomplete"
                                            v-model="emisorAdvFilterValue"
                                            :items="emisoresAdv"
                                            item-text="emiNombre"
                                            item-value="idEmisor"
                                            clearable
                                            @change="getOperadoresByEmisorAdv"
                                            ></v-autocomplete>
                                        </v-col>

                                        <!-- OPERADORES -->
                                        <v-col cols="12" xs="12" sm="12" md="6" lg="3" xl="3">
                                            <v-autocomplete
                                            label="Operadores"
                                            class="font-class-name1"
                                            v-model="operadorAdvFilterValue"
                                            :items="operadoresAdv"
                                            item-text="opeNombre"
                                            item-value="idOperador"
                                            clearable
                                            Dense                
                                            ></v-autocomplete>
                                        </v-col>

                                        <!-- CADENAS -->
                                        <v-col cols="12" xs="12" sm="12" md="6" lg="2" xl="2">
                                            <v-autocomplete
                                            label="Cadenas"
                                            class="font-class-name1"
                                            v-model="cadenaAdvFilterValue"
                                            :items="cadenasAdv"
                                            item-text="cadNombre"
                                            item-value="idCadena"
                                            clearable
                                            Dense    
                                            @change="getLocalesByCadenaAdv"                 
                                            ></v-autocomplete>
                                        </v-col>

                                    </v-row>

                                    <v-row>

                                        <!-- LOCALES -->
                                        <v-col cols="12" xs="12" sm="12" md="6" lg="3" xl="3">
                                            <v-autocomplete
                                            label="Locales"
                                            class="font-class-name1 custom-autocomplete"
                                            v-model="localAdvFilterValue"
                                            :items="blocalesAdv"
                                            item-text="loc_nombre"
                                            item-value="id_local"
                                            clearable
                                            multiple       
                                            ></v-autocomplete>
                                        </v-col>

                                        <!-- NÚMERO TRX -->
                                        <v-col cols="12" xs="12" sm="12" md="6" lg="1" xl="1">
                                            <v-text-field
                                            v-model="numeroTrxFilterValue"
                                            label="N° Trx"></v-text-field>
                                        </v-col>

                                        <!-- MONTO -->
                                        <v-col cols="12" xs="12" sm="12" md="6" lg="1" xl="1">
                                            <v-text-field
                                            v-model="montoFilterValue"
                                            label="Monto"></v-text-field>
                                        </v-col>

                                        <!-- CÓDIGO AUTOR -->
                                        <v-col cols="12" xs="12" sm="12" md="6" lg="2" xl="2">
                                            <v-text-field
                                            v-model="codigoAutorFilterValue"
                                            label="Codigo Autor"></v-text-field>
                                        </v-col>

                                        <!-- ID TRX -->
                                        <v-col cols="12" xs="12" sm="12" md="6" lg="3" xl="3">
                                            <v-text-field
                                            v-model="idTrxFilterValue"
                                            label="IdTrx"></v-text-field>
                                        </v-col>

                                        <!-- ÚLTIMOS 4 DÍGITOS -->
                                        <v-col cols="12" xs="12" sm="12" md="6" lg="2" xl="2">
                                            <v-text-field
                                            v-model="ultimos4digitosFilterValue"
                                            label="Ult. 4 dígitos"></v-text-field>
                                        </v-col>

                                    </v-row>

                                    <!--BOTONES-->
                                    <v-row>
                                        <v-spacer></v-spacer>

                                        <!-- GENERAR DETALLE -->
                                        <v-col cols="12" xs="12" sm="12" md="6" lg="2" xl="2">
                                            <b-button class="btn-sm btn-icon w-100" variant="primary" @click="detalleByFiltro(false)">
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
            
            <!-- TEMPLATE PARA COLUMNA CONTADOR ANOTACIONES -->
            <template v-slot:[`item.lan_cant`]="{ item }">
                <v-badge center v-if="item.lan_cant > 0">
                    <template v-slot:badge>
                        <span>{{ item.lan_cant }}</span>
                    </template>
                </v-badge>
            </template>

            <!-- TEMPLATE PARA COLUMNA ACCIONES -->
            <template v-slot:[`item.actions`]="{ item }">
                <v-tooltip right>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn text icon color="blue lighten-2">
                            <v-icon 
                            small 
                            v-bind="attrs" 
                            v-on="on"
                            @click="showDialogAnotaciones(item.id_trx)">mdi-view-list</v-icon>
                        </v-btn>
                    </template>
                    <span>Ver Historial de anotaciones ingresadas</span>
                </v-tooltip>
                <v-tooltip right>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn text icon color="blue lighten-2">
                            <v-icon 
                            small 
                            v-bind="attrs" 
                            v-on="on"
                            @click="showDialogCambioDeEstado(item.id_trx)">mdi-list-status</v-icon>
                        </v-btn>
                    </template>
                    <span>Ver Historial de Cambio de Estados</span>
                </v-tooltip>
            </template>

            <template v-slot:no-data>
                <span>No hay registros</span>
            </template>

            <template v-if="this.desserts.length > 0" v-slot:footer>
                <!--BOTONES-->
                <v-container>
                    <v-row>
                    <v-spacer></v-spacer>

                    <!-- REGISTRAR ANOTACIÓN -->
                    <v-col cols="12" xs="12" sm="12" md="6" lg="3" xl="3">
                        <b-button class="btn-sm btn-icon w-100" variant="primary" @click="showDialogRegistroAnotaciones()">
                            <i class="pe-7s-pen btn-icon-wrapper"></i>Registrar Anotación
                        </b-button>
                    </v-col>

                </v-row>
                </v-container>
            </template>
            
        </v-data-table>
    </div>
</template>
<script>

import { getCadenas, getLocales, getLocalesByCadena, getEmisores, getOperadoresByEmisor, 
    getTarjetasByEmisor, getTipoTrxByEmisor, getEstadoConciliaciones, getEstadoLiquidaciones,
    getConsultaTransaccionesByFiltro, getConsultaAvanzadaTransaccionesByFiltro, 
    getAnotacionesByIdtrx, getCambioEstadoTrxByIdtrx, getEstadoConciliacionDisponible, 
    updateEstadoConciliacionTrx, saveAnotacionesTrx } from '../services/ConccoavtranService';
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
            operadorFilterValue: '',
            operadores: [],
            tarjetaFilterValue: '',
            tarjetas: [],
            tipotrxFilterValue: '',
            tiposTrx: [],
            estadoConciliacionFilterValue: '',
            estadosConciliacion: [],
            estadoLiquidacionFilterValue: '',
            estadosLiquidacion: [],
            detalleTransaccionesFilterValue: false,
            //FILTROS AVANZADOS
            menu1Adv: '',
            menu2Adv: '',
            startDateAdv:null,
            endDateAdv:null,
            emisorAdvFilterValue: '',
            emisoresAdv: [],
            operadorAdvFilterValue: '',
            operadoresAdv: [],
            cadenaAdvFilterValue: '',
            cadenasAdv: [],
            localAdvFilterValue: '',
            blocalesAdv:[],
            numeroTrxFilterValue: '',
            montoFilterValue: '',
            codigoAutorFilterValue: '',
            idTrxFilterValue: '',
            ultimos4digitosFilterValue: '',
            //TABLA
            selected: [],
            tableHeaders : [
                { text: "", value: "lan_cant"},
                { text: "Acción", value: "actions"},
                { text: "Fecha", value: "trx_fecha_formateada"},
                { text: "Fecha Abono", value: "liq_fechapago"},
                { text: "Cadena", value: "cad_nombre"},
                { text: "Local", value: "loc_nombre"},
                { text: "Emisor", value: "emi_nombre"},
                { text: "Operador", value: "ope_nombre"},
                { text: "Tipo Trx", value: "ttx_nombre"},
                { text: "POS", value: "trx_pos"},
                { text: "N° Trx", value: "trx_boleta"},
                { text: "N° Tarjeta/Vale", value: "trx_numtarjeta"},
                { text: "Monto Total "+config.symbolMoney, value: "trx_monto"},
                { text: "Estado Conciliación", value: "ecn_descripcion"},
                { text: "Cod. Autor", value: "trx_codautor"},
                { text: "Estado Liquidación", value: "eli_descripcion"},
                { text: "Monto Liquidado "+config.symbolMoney, value: "trx_montoliquidado"},
                { text: "Medio Pago", value: "tar_nombre"},
                { text: "Disefec. "+config.symbolMoney, value: "trx_vuelto"},
                { text: "Cambio de Pago", value: "per_cambio_pago"},
                { text: "IdTrx", value: "trx_idcon"},
            ],
            desserts: [],
            loadTable: false,
            search: "",
            singleSelect: false,

            // BOOLEAN PARA RESETEAR LA TABLA EN FILTRO BASICO O AVANZADO
            isFiltroBasico: true,

            // MODAL HISTORIAL DE ANOTACIONES
            dialogAnotaciones: false,
            selectedAnotacion: [],
            tableHeadersAnotacion: [
                { text: "Fecha", value: "lan_fecha", width: "25%"},
                { text: "Autor", value: "usu_nombre", width: "25%"},
                { text: "Anotación", value: "lan_anotacion", width: "50%"}
            ],
            dessertsAnotacion: [],
            loadTableAnotacion: false,

            // MODAL HISTORIAL CAMBIO DE ESTADO
            dialogCambioEstado: false,
            selectedCambioEstado: [],
            tableHeadersCambioEstado: [
                { text: "Fecha", value: "ces_fecha", width: "25%"},
                { text: "Hora", value: "ces_hora", width: "25%"},
                { text: "Estado Conciliación", value: "ecn_descripcion", width: "25%"},
                { text: "Estado Liquidación", value: "eli_descripcion", width: "25%"}
            ],
            dessertsCambioEstado: [],
            loadTableCambioEstado: false,

            // MODAL REGISTRO DE ANOTACIONES
            loaderDialog: false,
            dialogRegistroAnotaciones: false,
            nuevoEstadoConciliacionFilterValue: '',
            nuevoEstadoConciliacion: [],
            totalTrxFilterValue: '',
            montoTotalFilterValue: '',
            anotacionFilterValue: '',

            //DATOS DESDE MONITOS DE CONCILIACION MP
            monitor: false,
            idemisor: '',
            estadoconciliacion: '',
            fini: '',
            ffin: ''
        };
    },

    created() {
        this.monitor = this.$route.query.monitor;
        this.idemisor = this.$route.query.idemisor;
        this.estadoconciliacion = this.$route.query.estadoconciliacion;
        this.fini = this.$route.query.fini;
        this.ffin = this.$route.query.ffin;

        //SI MONITOR ESTÁ ACTIVO, SETEA LOS INPUTS Y BUSCA EL DETALLE
        if (this.monitor) {
            this.startDate = this.fini;
            this.endDate = this.ffin;
            this.estadoLiquidacionFilterValue = ['REC','LIP','RET','REP'];
            this.estadoConciliacionFilterValue = this.estadoconciliacion.split(',');
        }
    },
    
    computed: {
        // FORMATEAR FECHAS
        computedDateFormatted1() {
            return this.formatDate1(this.startDate);
        },
        computedDateFormatted2() {
            return this.formatDate1(this.endDate);
        },
        computedDateFormatted3() {
            return this.formatDate1(this.startDateAdv);
        },
        computedDateFormatted4() {
            return this.formatDate1(this.endDateAdv);
        },
    },

    async mounted() {
        // CONSUME SERVICIOS
        this.loader = true;
        this.cadenas = this.cadenasAdv = await getCadenas();
        this.blocales = this.blocalesAdv = await getLocales();
        this.emisores = this.emisoresAdv = await getEmisores();
        this.estadosConciliacion = await getEstadoConciliaciones();
        this.estadosLiquidacion = await getEstadoLiquidaciones();

        //SI MONITOR ESTÁ ACTIVO, SETEA LOS INPUTS Y BUSCA EL DETALLE
        if (this.monitor) {
            this.setSelectedEmisor();
            this.detalleByFiltro(true);
        }

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

        /* SERVICIO OBTIENE TARJETAS POR EMISOR SELECCIONADO */
        async getTarjetasByEmisor() {
            this.tarjetas = [];
            this.tarjetaFilterValue = [];
            this.tarjetas = await getTarjetasByEmisor(this.emisorFilterValue);
        },

        /* SERVICIO OBTIENE TIPOS DE TRX POR EMISOR SELECCIONADO */
        async getTipoTrxByEmisor() {
            this.tiposTrx = [];
            this.tipotrxFilterValue = [];
            this.tiposTrx = await getTipoTrxByEmisor(this.emisorFilterValue);
        },

        /* SERVICIO OBTIENE OPERADORES POR EMISOR SELECCIONADO EN FILTRO AVANZADO */
        async getOperadoresByEmisorAdv() {
            this.operadoresAdv = [];
            this.operadorAdvFilterValue = [];
            this.operadoresAdv = await getOperadoresByEmisor(this.emisorAdvFilterValue);
        },

        /* SERVICIO OBTIENE LOCALES POR CADENA SELECCIONADA EN FILTRO AVANZADO */
        async getLocalesByCadenaAdv() {
            this.blocalesAdv = [];
            this.localAdvFilterValue = [];
            if (this.cadenaAdvFilterValue == null || this.cadenaAdvFilterValue == "") {
                this.blocalesAdv = await getLocales();
            } else {
                this.blocalesAdv = await getLocalesByCadena(this.cadenaAdvFilterValue);
            }
        },

        /* SERVICIO OBTIENE DETALLE POR FILTROS */
        async detalleByFiltro(isFiltrobasico) {
            this.isFiltrobasico = isFiltrobasico;
            this.desserts = [];
            this.selected = [];

            if (isFiltrobasico) {
                // FILTRO BASICO
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
                    if (this.operadorFilterValue == "") {
                        this.operadorFilterValue = null;
                    }
                    if (this.tarjetaFilterValue == "") {
                        this.tarjetaFilterValue = null;
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

                    const filtroBasico = {
                        id_cadena: this.cadenaFilterValue,
                        id_local: this.localFilterValue,
                        id_emisor: this.emisorFilterValue,
                        id_operador: this.operadorFilterValue,
                        id_tarjeta: this.tarjetaFilterValue,
                        id_tipo_trx: this.tipotrxFilterValue,
                        estado_con: this.estadoConciliacionFilterValue,
                        estado_liq: this.estadoLiquidacionFilterValue,
                        fechainicio: this.startDate,
                        fechatermino: this.endDate,
                        is_itl_enabled: null,
                        is_mediopago_enabled: false,
                        id_usuario: null, // EDITAR CUANDO SE TERMINE PERFILAMIENTO
                        is_peru_enabled: true,
                        id_estado_trx: null,
                        idcomercio: null,
                        es_vale: null,
                        is_petrobras_enabled: null,
                        per_codigo_grupo_banco: null,
                        per_cuenta_contable: null,
                        per_motivo_anulacion: null,
                    };

                    try {
                        const listaConsultaTransacciones = await getConsultaTransaccionesByFiltro(filtroBasico);
                            this.showInfoMsg({message: "Se encontraron " + listaConsultaTransacciones.length + " registros."});
                            if (listaConsultaTransacciones.length != 0) {
                                listaConsultaTransacciones.forEach((objConsultaTransacciones) => {
                                    if (objConsultaTransacciones.lan_cant == null) {
                                        objConsultaTransacciones.lan_cant = 0;
                                    }
                                    if (objConsultaTransacciones.trx_monto != null) {
                                        objConsultaTransacciones.trx_monto = objConsultaTransacciones.trx_monto.toFixed(2);
                                    }

                                    if (objConsultaTransacciones.trx_montoliquidado != null) {
                                        objConsultaTransacciones.trx_montoliquidado = objConsultaTransacciones.trx_montoliquidado.toFixed(2);
                                    }

                                    if (objConsultaTransacciones.trx_vuelto != null) {
                                        objConsultaTransacciones.trx_vuelto = objConsultaTransacciones.trx_vuelto.toFixed(2);
                                    }

                                    objConsultaTransacciones.trx_fecha_formateada = objConsultaTransacciones.trx_fecha + " " + objConsultaTransacciones.trx_hora;
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

            } else {

                // FILTRO AVANZADO
                // VALIDACIONES
                /* VALIDA QUE FECHA INICIO NO SEA MAYOR A FECHA FIN */
                if (!this.validaFechaFinMayorAFechaInicio(this.startDateAdv, this.endDateAdv)) {
                    this.showWarnMsg({message: "La fecha de fin del periodo debe ser mayor o igual a la fecha de inicio."});
                    return;
                }

                /* VALIDA MAXIMO DE DIAS NO SUPERE A 31 */
                if (!this.validaMaximoDias(this.startDateAdv, this.endDateAdv)) {
                    this.showWarnMsg({message: "El rango de fechas no debe ser mayor a 31 días."});
                    return;
                }

                if (!this.startDateAdv) {
                    this.showWarnMsg({message: "Debe seleccionar una Fecha de Inicio."});
                }
                if (!this.endDateAdv) {
                    this.showWarnMsg({message: "Debe seleccionar una Fecha de Término."});
                }
                
                /* OBTENER DETALLE EN BASE A FILTROS */
                if (this.startDateAdv && this.endDateAdv) {
                    this.loader = true;
                    if (this.startDateAdv == "") {
                        this.startDateAdv = null;
                    }
                    if (this.endDateAdv == "") {
                        this.endDateAdv = null;
                    }
                    if (this.cadenaAdvFilterValue == "") {
                        this.cadenaAdvFilterValue = null;
                    }
                    if (this.localAdvFilterValue == "") {
                        this.localAdvFilterValue = null;
                    }
                    if (this.emisorAdvFilterValue == "") {
                        this.emisorAdvFilterValue = null;
                    }
                    if (this.operadorAdvFilterValue == "") {
                        this.operadorAdvFilterValue = null;
                    }
                    if (this.numeroTrxFilterValue == "") {
                        this.numeroTrxFilterValue = null;
                    }
                    if (this.montoFilterValue == "") {
                        this.montoFilterValue = null;
                    }
                    if (this.codigoAutorFilterValue == "") {
                        this.codigoAutorFilterValue = null;
                    }
                    if (this.idTrxFilterValue == "") {
                        this.idTrxFilterValue = null;
                    }
                    if (this.ultimos4digitosFilterValue == "") {
                        this.ultimos4digitosFilterValue = null;
                    }
                    
                    const filtroAvanzado = {
                        id_cadena: this.cadenaAdvFilterValue,
                        locales: this.localAdvFilterValue,
                        id_emisor: this.emisorAdvFilterValue,
                        id_operador: this.operadorAdvFilterValue,
                        f_ini: this.startDateAdv,
                        f_fin: this.endDateAdv,
                        boleta: this.numeroTrxFilterValue,
                        monto: this.montoFilterValue,
                        codautor: this.codigoAutorFilterValue,
                        idcon: this.idTrxFilterValue,
                        trx_numtarjeta: this.ultimos4digitosFilterValue,
                        id_usuario: null, // EDITAR CUANDO SE TERMINE PERFILAMIENTO
                        is_peru_enabled: true,
                        id_comercio: null,
                        is_itl_enabled: null,
                        is_petrobras_enabled: null,
                        per_codigo_grupo_banco: null,
                        per_cuenta_contable: null,
                        vale: null,
                        es_vale: null,
                        per_motivo_anulacion: null,
                    };

                    try {
                        const listaConsultaTransacciones = await getConsultaAvanzadaTransaccionesByFiltro(filtroAvanzado);
                            this.showInfoMsg({message: "Se encontraron " + listaConsultaTransacciones.length + " registros."});
                            if (listaConsultaTransacciones.length != 0) {
                                listaConsultaTransacciones.forEach((objConsultaTransacciones) => {
                                    if (objConsultaTransacciones.lan_cant == null) {
                                        objConsultaTransacciones.lan_cant = 0;
                                    }
                                    objConsultaTransacciones.trx_fecha_formateada = objConsultaTransacciones.trx_fecha + " " + objConsultaTransacciones.trx_hora;
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
                
            }
            
            this.loader = false;
        },

        /* EXPORTA REGISTROS DE TABLA A PLANILLA .XLSX */
        exportarPlanilla() {
            this.loader = true;

            try {
                if (this.desserts.length > 0) {
                    let data = this.desserts.map(row => ({
                    'Fecha': row.trx_fecha,
                    'Hora': row.trx_hora,
                    'Fecha Abono': row.liq_fechapago,
                    'Cadena': row.cad_nombre,
                    'Local': row.loc_nombre,
                    'Emisor': row.emi_nombre,
                    'Operador': row.ope_nombre,
                    'TipoTrx': row.ttx_nombre,
                    'POS': row.trx_pos,
                    'N° Trx': row.trx_boleta,
                    'Tarjeta': row.trx_numtarjeta,
                    ['Monto Total ' + config.symbolMoney]: row.trx_monto,
                    'Estado(con)': row.ecn_descripcion,
                    'Cod.Autor': row.trx_codautor,
                    'Estado(Liq)': row.eli_descripcion,
                    ['Monto Liquidado ' + config.symbolMoney]: row.trx_montoliquidado,
                    'Medio Pago': row.tar_nombre,
                    ['Disefec. ' + config.symbolMoney]: row.trx_vuelto,
                    'Cambio Pago': row.per_cambio_pago,
                    'IdTrx': row.trx_idcon
                    }));
                    const ws = XLSX.utils.json_to_sheet(data);
                    const wb = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(wb, ws, "Consulta-Transacciones");
                    XLSX.writeFile(wb, "consulta-transacciones.xlsx");
                    this.showSuccessMsg({message: "Se generó la planilla con éxito."});
                } else {
                    this.showWarnMsg({message: "No hay registros para exportar."});
                }
                
            } catch (error) {
                console.log(error);
                this.showErrorMsg({message: "Hubo un error al generar planilla."});
            }
            this.loader = false;
        },

        /* SERVICIO OBTIENE ANOTACIONES POR IDTRX DE REGISTRO DE TABLA */
        async showDialogAnotaciones(idtrx) {
            this.dessertsAnotacion = [];     
            try {
                const listaAnotaciones = await getAnotacionesByIdtrx(idtrx);
                this.showInfoMsg({message: "Se encontraron " + listaAnotaciones.length + " registros."});
                if (listaAnotaciones.length != 0) {
                    listaAnotaciones.forEach((objAnotaciones) => {
                        objAnotaciones.lan_fecha = objAnotaciones.lan_fecha + " " + objAnotaciones.lan_hora;
                        this.dessertsAnotacion.push(objAnotaciones);
                    });
                }
                
            } catch (error) {
                console.log(error);
                this.showErrorMsg({message: "Hubo un error al obtener los registros."});
            }
            
            this.dialogAnotaciones = true;

        },

        /* SERVICIO OBTIENE CAMBIOS DE ESTADO POR IDTRX DE REGISTRO DE TABLA */
        async showDialogCambioDeEstado(idtrx) {
            this.dessertsCambioEstado = [];     
            try {
                const listaCambioEstado = await getCambioEstadoTrxByIdtrx(idtrx);
                this.showInfoMsg({message: "Se encontraron " + listaCambioEstado.length + " registros."});
                if (listaCambioEstado.length != 0) {
                    listaCambioEstado.forEach((objCambioEstado) => {
                        this.dessertsCambioEstado.push(objCambioEstado);
                    });
                }
                
            } catch (error) {
                console.log(error);
                this.showErrorMsg({message: "Hubo un error al obtener los registros."});
            }
            
            this.dialogCambioEstado = true;

        },

        /* SERVICIO PARA MOSTRAR MODAL ANOTACIONES CON VALIDACIONES DE TRX SELECCIONADAS */
        async showDialogRegistroAnotaciones() {

            this.nuevoEstadoConciliacionFilterValue = '';
            this.nuevoEstadoConciliacion = [];
            this.totalTrxFilterValue = '';
            this.montoTotalFilterValue = '';
            this.anotacionFilterValue = '';

            /* VALIDA QUE SE SELECCIONE AL MENOS UNA TRANSACCIÓN */
            if (this.selected.length == 0) {
                this.showWarnMsg({message: "Para Registrar Anotación debe seleccionar mínimo una transacción."});
                return;
            }

            /* VALIDA QUE SE SELECCIONE UN UNICO EMISOR */
            if (!this.validarAtributoIgual(this.selected, 'id_emisor')) {
                this.showWarnMsg({message: "Para Registrar Anotación todas las transacciones deben ser del mismo emisor."});
                return;
            }

            /* VALIDA QUE SE SELECCIONE UN UNICO EMISOR */
            if (!this.validarAtributoIgual(this.selected, 'ecn_estado_con')) {
                this.showWarnMsg({message: "Para Registrar Anotación todas las transacciones deben tener el mismo estado de conciliación."});
                return;
            }

            this.loader = true;

            this.nuevoEstadoConciliacion = await getEstadoConciliacionDisponible(this.selected[0]['ecn_estado_con'], this.selected[0]['id_emisor']);

            /* OBTIENE TOTAL DE TRANSACCIONES SELECCIONADAS */
            this.totalTrxFilterValue = this.selected.length;
            
            /* OBTIENE SUMA TOTAL DE LOS MONTOS CONCILIADOS DE LAS TRANSACCIONES SELECCIONADAS */
            this.montoTotalFilterValue = this.selected.map(function(trx) {
                return trx.trx_monto;
            }).reduce(function(acumulador, montoTrx) {
                return (acumulador + montoTrx);
            }, 0);

            this.loader = false;
            this.dialogRegistroAnotaciones = true;

        },

        /* METODO PARA VALIDAR SI LOS ATRIBUTOS SON UNICOS */
        validarAtributoIgual(arr, atributo) {
            if (!Array.isArray(arr) || arr.length === 0) {
                return false; // El array está vacío o no es un array
            }

            const valorAtributo = arr[0][atributo]; // Valor del atributo en el primer objeto

            for (let i = 1; i < arr.length; i++) {
                if (arr[i][atributo] !== valorAtributo) {
                return false; // Se encontró un valor distinto
                }
            }

            return true; // Todos los objetos tienen el mismo valor para el atributo
        },

        /* MÉTODO PARA CERRAR DIALOG DE ANOTACIONES */
        cerrarDialogAnotaciones() {
            this.dialogRegistroAnotaciones = false;
        },

        /* MÉTODO PARA REGISTRAR EL CAMBIO DE ESTADO DE LAS TRX Y/O INGRESAR ANOTACIÓN */
        async registrarCambioEstadoAnotacion() {

            if (this.nuevoEstadoConciliacionFilterValue == "") {
                this.nuevoEstadoConciliacionFilterValue = null;
            }
            if (this.anotacionFilterValue == "") {
                this.anotacionFilterValue = null;
            }

            if (this.nuevoEstadoConciliacionFilterValue === null && this.anotacionFilterValue === null) {
                this.showWarnMsg({message: "Se debe seleccionar un nuevo cambio de estado y/o ingresar nueva anotación."});
                return;
            } else {
                this.loaderDialog = true;
                let listadoFiltroActualizaTrx = [];
                let listadoFiltroLogAnotaciones = [];

                // RECORRE TRX SELECCIONADAS
                this.selected.forEach((objTrxSeleccionada) => {

                    // GENERA LISTADO CAMBIO DE ESTADO
                    const filtroActualizaTrx = {
                    id_trx: objTrxSeleccionada.id_trx,
                    estado_con: this.nuevoEstadoConciliacionFilterValue,
                    trx_if_apr: null,
                    per_motivo_anulacion: null,
                    estado_liq: objTrxSeleccionada.eli_estado_liq
                    };
                    listadoFiltroActualizaTrx.push(filtroActualizaTrx);

                    // GENERA LISTADO ANOTACIONES
                    const filtroLogAnotaciones = {
                    id: null,
                    fecha: null,
                    anotacion: this.anotacionFilterValue,
                    idtrx: objTrxSeleccionada.id_trx,
                    idusuario: 1 // EDITAR CUANDO SE TERMINE PERFILAMIENTO
                    };
                    listadoFiltroLogAnotaciones.push(filtroLogAnotaciones);

                });

                // SI SOLO SE CAMBIA EL ESTADO DE LAS TRX Y NO SE INGRESA ANOTACIÓN
                if (this.nuevoEstadoConciliacionFilterValue != null && this.anotacionFilterValue == null) {
                    try {
                        const listaTRX = await updateEstadoConciliacionTrx(listadoFiltroActualizaTrx);
                            this.showInfoMsg({message: "Se actualizaron " + listaTRX.length + " Transacciones."});
                    } catch (error) {
                        console.log(error);
                        this.showErrorMsg({message: "Hubo un error al actualizar las transacciones."});
                    }
                }
                // SI SOLO SE INGRESA ANOTACIÓN Y NO SE CAMBIA EL ESTADO DE LAS TRX
                else if (this.nuevoEstadoConciliacionFilterValue == null && this.anotacionFilterValue != null) {
                    try {
                        const listaLogAnotaciones = await saveAnotacionesTrx(listadoFiltroLogAnotaciones);
                            this.showInfoMsg({message: "Se guardaron " + listaLogAnotaciones.length + " anotaciones."});
                    } catch (error) {
                        console.log(error);
                        this.showErrorMsg({message: "Hubo un error al guardar las anotaciones."});
                    }
                }
                // SI SE CAMBIA EL ESTADO DE LAS TRX Y SE INGRESA ANOTACIÓN
                else {
                    try {
                        const listaTRX = await updateEstadoConciliacionTrx(listadoFiltroActualizaTrx);
                            this.showInfoMsg({message: "Se actualizaron " + listaTRX.length + " Transacciones."});
                    } catch (error) {
                        console.log(error);
                        this.showErrorMsg({message: "Hubo un error al actualizar las transacciones."});
                    }

                    try {
                        const listaLogAnotaciones = await saveAnotacionesTrx(listadoFiltroLogAnotaciones);
                            this.showInfoMsg({message: "Se guardaron " + listaLogAnotaciones.length + " anotaciones."});
                    } catch (error) {
                        console.log(error);
                        this.showErrorMsg({message: "Hubo un error al guardar las anotaciones."});
                    }
                }
                this.detalleByFiltro(this.isFiltrobasico);
                this.dialogRegistroAnotaciones = false;
            }
            this.loaderDialog = false;
        },

        setSelectedEmisor() {
            const selectedEmisor = this.emisores.find(emisor => emisor.idEmisor == this.idemisor);
            if (selectedEmisor) {
                this.emisorFilterValue = selectedEmisor.idEmisor;
                this.getOperadoresByEmisor();
                this.getTarjetasByEmisor();
                this.getTipoTrxByEmisor();
            }
        },

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

.scrollable-card-body {
    overflow-y: auto;
}

</style>