<template>
    <div>
        <!-- LOADER -->
        <VueElementLoading :active="loader" spinner="bar-fade-scale" color="var(--primary)"/>

        <!-- DIALOG DE CONCILIACION MANUAL -->
        <v-dialog v-model="dialogConciliacionManual" scrollable>
            <div class="main-card mb-3 card">
              <div class="card-header rdmqc">Registra anotación y confirma...</div>
              <div class="card-body scrollable-card-body">
                <!-- LOADER -->
                <VueElementLoading :active="loaderDialogConciliacionManual" spinner="bar-fade-scale" color="var(--primary)"/>
                <p class="mb-0"><em>Ingresa una anotación y confirma la conciliación manual</em></p>
                <hr/>
                <p><b><u>Información de las transacciones</u></b></p>
                <v-container class="m-0 p-0">
                    <v-row>

                        <!-- TRX DESCONOCIDAS -->
                        <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6">
                            <v-text-field
                            :readonly="true"
                            v-model="totalTrxDesconocidasSeleccionadas"
                            label="Trx desconocidas"></v-text-field>
                        </v-col>

                        <!-- TRX PRE-LITIGIOS -->
                        <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6">
                            <v-text-field
                            :readonly="true"
                            v-model="totalTrxPrelitigioSeleccionadas"
                            label="Trx Pre-litigios"></v-text-field>
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
                <button class="mr-2 btn btn-link btn-sm" @click="cerrarDialogConciliacionManual">Volver</button>
                <b-button class="btn-sm btn-icon" variant="success" @click="conciliarManualmenteTrxSeleccionadas()">
                    <i class="pe-7s-pen btn-icon-wrapper"></i>Conciliar Manualmente
                </b-button>
              </div>
            </div>
        </v-dialog>

        <v-card>
            <!-- TÍTULO PANTALLA -->
            <v-toolbar flat color="white">
                    <v-toolbar-title class="rdmqc">Conciliación Manual Pago de Servicios</v-toolbar-title>
                </v-toolbar>

                <!-- EXPANDER PARA FILTROS -->
                <v-expansion-panels class="pb-3">
                    <!-- FILTROS CARTA DE RECLAMO -->
                    <v-expansion-panel>
                        <v-expansion-panel-header><i class="pe-7s-edit"> Filtros</i></v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <v-container>

                                    <!--INPUTS-->
                                    <v-row>

                                        <!-- FECHA INICIO -->
                                        <v-col cols="12" xs="12" sm="12" md="6" lg="3" xl="3">
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
                                                locale="es-CL"
                                                @input="menu1 = false"
                                                ></v-date-picker>
                                            </v-menu>
                                        </v-col>
                                        
                                        <!-- FECHA TERMINO -->
                                        <v-col cols="12" xs="12" sm="12" md="6" lg="3" xl="3">
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
                                            @change="getTipoTrxByEmisor()"
                                            ></v-autocomplete>
                                        </v-col>

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
           
                                    </v-row>

                                    <v-row>

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
                                        <v-col cols="12" xs="12" sm="12" md="6" lg="4" xl="4">
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

                                    </v-row>

                                    <v-row>

                                    <!-- CRITERIOS EMISOR -->
                                    <v-col cols="12" xs="12" sm="12" md="6" lg="2" xl="2">
                                        <v-switch v-model="ctEmisorFilterValue" label="Emisor"
                                        color="info" true-value="true" false-value="false" hide-details></v-switch>
                                    </v-col>

                                    <!-- CRITERIOS FECHA -->
                                    <v-col cols="12" xs="12" sm="12" md="6" lg="2" xl="2">
                                        <v-switch v-model="ctFechaFilterValue" label="Fecha"
                                        color="info" true-value="true" false-value="false" hide-details></v-switch>
                                    </v-col>

                                    <!-- CRITERIOS LOCAL -->
                                    <v-col cols="12" xs="12" sm="12" md="6" lg="2" xl="2">
                                        <v-switch v-model="ctLocalFilterValue" label="Local"
                                        color="info" true-value="true" false-value="false" hide-details></v-switch>
                                    </v-col>

                                    <!-- CRITERIOS MONTO -->
                                    <v-col cols="12" xs="12" sm="12" md="6" lg="2" xl="2">
                                        <v-switch v-model="ctMontoFilterValue" label="Monto"
                                        color="info" true-value="true" false-value="false" hide-details></v-switch>
                                    </v-col>

                                    <!-- CRITERIOS NUMERO TARJETA -->
                                    <v-col cols="12" xs="12" sm="12" md="6" lg="2" xl="2">
                                        <v-switch v-model="ctNumTarjetaFilterValue" label="Suministro"
                                        color="info" true-value="true" false-value="false" hide-details></v-switch>
                                    </v-col>

                                    <!-- CRITERIOS Cod. Autorización -->
                                    <v-col cols="12" xs="12" sm="12" md="6" lg="2" xl="2">
                                        <v-switch v-model="ctCodAutorizacionFilterValue" label="Cod. Aut."
                                        color="info" true-value="true" false-value="false" hide-details></v-switch>
                                    </v-col>

                                    </v-row>

                                    <!--BOTONES-->
                                    <v-row>
                                        <v-spacer></v-spacer>

                                        <!-- GENERAR DETALLE -->
                                        <v-col cols="12" xs="12" sm="12" md="6" lg="2" xl="2">
                                            <b-button class="btn-sm btn-icon w-100" variant="primary" @click="detalleByFiltro()">
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

                <!-- TABLAS PARA CONCILIACION MANUAL-->
                <div class="scrollable-div">
                    <table>
                        <tr valign="top" height="30">
                            <td width="15" height="1" bgcolor="#CCCCCC" class="texto_ht1">&nbsp;</td>
                            <!-- TABLA PRE-LITIGIO -->
                            <td width="70" bgcolor="#CCCCCC" class="texto_ht1" align="center">
                                <a href="#">Fecha</a>
                            </td>
                            <td width="140" bgcolor="#CCCCCC" class="texto_ht1" align="center">
                                <a href="#">Cadena</a>
                            </td>
                            <td width="150" bgcolor="#CCCCCC" class="texto_ht1" align="center">
                                <a href="#">Local</a>
                            </td>
                            <td width="40" bgcolor="#CCCCCC" class="texto_ht1" align="center">
                                <a href="#">POS</a>
                            </td>
                            <td width="50" bgcolor="#CCCCCC" class="texto_ht1" align="right">
                                <a href="#">N° Trx </a>
                            </td>
                            <td width="60" bgcolor="#CCCCCC" class="texto_ht1" align="center">
                                <a href="#">Emisor</a>
                            </td>
                            <td width="70" bgcolor="#CCCCCC" class="texto_ht1" align="center">
                                <a href="#">Tipo Trx</a>
                            </td>
                            <td width="60" bgcolor="#CCCCCC" class="texto_ht1" align="right">
                                <a href="#">Monto {{ moneda }}</a>
                            </td>
                            <td width="5" bgcolor="#CCCCCC" class="texto_ht1">&nbsp;</td>
                            <td width="60" bgcolor="#CCCCCC" class="texto_ht1" align="center">Estado</td>
                            <!-- ... -->
                            <td width="15" bgcolor="#E5E5E5" class="texto_ht1">&nbsp;</td>
                            <!-- TABLA DESCONOCIDAS -->
                            <td width="60" bgcolor="#E5E5E5" class="texto_ht1" align="center">Fecha</td>
                            <td width="120" bgcolor="#E5E5E5" class="texto_ht1" align="center">Cadena</td>
                            <td width="180" bgcolor="#E5E5E5" class="texto_ht1" align="center">Local</td>
                            <td width="60" bgcolor="#E5E5E5" class="texto_ht1" align="center">POS</td>
                            <td width="20" bgcolor="#E5E5E5" class="texto_ht1" align="center"><!-- N° Trx --></td>
                            <td width="60" bgcolor="#E5E5E5" class="texto_ht1" align="center">Emisor</td>
                            <td width="70" bgcolor="#E5E5E5" class="texto_ht1" align="center">Tipo Trx</td>
                            <td width="80" bgcolor="#E5E5E5" class="texto_ht1" align="left">Monto {{ moneda }}</td>
                            <td width="10" bgcolor="#E5E5E5" class="texto_ht1">&nbsp;</td>
                            <td width="65" bgcolor="#E5E5E5" class="texto_ht1" align="left">Estado</td>
                        </tr>
                        <tr>
                            <td colspan="22" height="1" bgcolor="#666666"></td>
                        </tr>

                        <tr>
                            <td colspan="23" width="1310">
                                <div align="left" style="width: 100%; height: 290px; overflow: auto;">
                                    <table border="0" cellspacing="0" cellpadding="0" width="1180" align="left">
                                        <tr>
                                            <td width="650" height="1"></td>
                                            <td width="650"></td>
                                        </tr>

                                        <!--VALIDA QUE LISTADO DE DETALLE DE TABLA SEA MAYOR QUE 0-->
                                        <template v-if="desserts.length > 0">
                                            <!--INICIO CICLO PRINCIPAL-->
                                            <div v-for="(objTrxConManual, cont) in desserts" :key="cont">

                                            <!--INICIA TR PRINCIPAL PARA CONTENER DOS TABLAS-->
                                            <tr>
                                                <!--INICIA TD TRX DUPLICADAS-->
                                                <td width="720" valign="top">

                                                    <!--INICIA TABLE TRX DUPLICADAS-->
                                                    <table border="0" cellspacing="0" cellpadding="0" width="720">
                                                        <tbody>
                                                            <tr v-for="(dup, index) in objTrxConManual.dup" :key="index">
                                                                <td width="15" align="right" height="17" :id="dup.id_trx">
                                                                    <input type="checkbox" v-model="duplicadasSeleccionadas" :value="dup" :name="'chkdup' + cont + '[]'" />
                                                                    <input type="hidden" :name="'dup' + cont" :value="dup.id_trx" class="texto7" size="3" />
                                                                    <input type="hidden" :name="'mdu' + cont" :value="dup.trx_monto" class="texto7" size="3" />
                                                                    <input type="hidden" :name="'liqdu' + cont" :value="dup.eli_estado_liq" class="texto7" size="2" />
                                                                    <input type="hidden" :name="'ckdu' + cont" value="N" class="texto7" size="1" />
                                                                </td>
                                                                <td width="70" align="center" height="17">
                                                                <span class="texto_tt1">{{ dup.trx_fecha | formatDate }}</span>
                                                                </td>
                                                                <td width="140" align="center" height="17">
                                                                <span class="texto_tt1">{{ dup.cad_nombre }}</span>
                                                                </td>
                                                                <td width="150" align="center" height="17">
                                                                <span class="texto_tt1">{{ dup.loc_nombre }}</span>
                                                                </td>
                                                                <td width="40" align="center" height="17">
                                                                <span class="texto_tt1">{{ dup.trx_pos }}</span>
                                                                </td>
                                                                <td width="50" align="center" height="17">
                                                                <span class="texto_tt1">{{ dup.trx_boleta }}</span>
                                                                </td>
                                                                <td width="60" align="center" height="17">
                                                                <span class="texto_tt1">{{ dup.emi_nombre }}</span>
                                                                </td>
                                                                <td width="70" align="center" height="17">
                                                                <span class="texto_tt1">{{ dup.ttx_nombre }}</span>
                                                                </td>
                                                                <td width="60" align="center" height="17">
                                                                <span class="texto_tt1">{{ dup.trx_monto }}</span>
                                                                </td>
                                                                <td width="5" align="center" height="17">
                                                                <span class="texto_tt1">&nbsp;</span>
                                                                </td>
                                                                <td width="60" align="center" height="17">
                                                                <span class="texto_tt1">{{ dup.ecn_descripcion }}</span>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                            <td colspan="1"></td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>

                                                <!--INICIA TD TRX DESCONOCIDAS-->
                                                <td width="740" valign="top">

                                                    <!--INICIA TABLE TRX DESCONOCIDAS-->
                                                    <table border="0" cellspacing="0" cellpadding="0" width="740">
                                                        <tbody>
                                                            <tr v-for="(des, index) in objTrxConManual.des" :key="index">
                                                                <td width="15" align="right" height="17" :id="des.id_trx">
                                                                    <input type="checkbox" v-model="desconocidasSeleccionadas" :value="des" :name="'chkdes' + cont + '[]'" />
                                                                    <input type="hidden" :name="'des' + cont" :value="des.id_trx" class="texto7" size="3" />
                                                                    <input type="hidden" :name="'mdu' + cont" :value="des.trx_monto" class="texto7" size="3" />
                                                                    <input type="hidden" :name="'liqdu' + cont" :value="des.eli_estado_liq" class="texto7" size="2" />
                                                                    <input type="hidden" :name="'ckdu' + cont" value="N" class="texto7" size="1" />
                                                                </td>
                                                                <td width="60" align="center" height="17">
                                                                <span class="texto_tt1">{{ des.trx_fecha | formatDate }}</span>
                                                                </td>
                                                                <td width="120" align="center" height="17">
                                                                <span class="texto_tt1">{{ des.cad_nombre }}</span>
                                                                </td>
                                                                <td width="180" align="center" height="17">
                                                                <span class="texto_tt1">{{ des.loc_nombre }}</span>
                                                                </td>
                                                                <td width="60" align="center" height="17">
                                                                <span class="texto_tt1">{{ des.trx_pos }}</span>
                                                                </td>
                                                                <td width="20" align="center" height="17">
                                                                <span class="texto_tt1">{{ des.trx_boleta }}</span>
                                                                </td>
                                                                <td width="60" align="center" height="17">
                                                                <span class="texto_tt1">{{ des.emi_nombre }}</span>
                                                                </td>
                                                                <td width="70" align="center" height="17">
                                                                <span class="texto_tt1">{{ des.ttx_nombre }}</span>
                                                                </td>
                                                                <td width="80" align="center" height="17">
                                                                <span class="texto_tt1">{{ des.trx_monto }}</span>
                                                                </td>
                                                                <td width="10" align="center" height="17">
                                                                <span class="texto_tt1">&nbsp;</span>
                                                                </td>
                                                                <td width="65" align="center" height="17">
                                                                <span class="texto_tt1">{{ des.ecn_descripcion }}</span>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                            <td colspan="1"></td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                            <tr><td colspan="2" height="2"></td></tr>
                                            <tr><td colspan="2" height="1" bgcolor="#666666"></td></tr>
                                            </div>
                                        </template>

                                        <!--SI LISTADO VIENE VACIO ENTONCES MUESTRA MENSAJE DE NO HAY TRX-->
                                        <template v-else>
                                            <tr>
                                                <td colspan="2" align="center" class="texto_no_data">No hay transacciones desconocidas</td>
                                            </tr>
                                        </template>

                                    </table>
                                </div>
                            </td>
                        </tr>
                    </table>
                </div>

                <template v-if="this.desserts.length > 0">
                    <v-container>
                        <v-row>
                        <v-spacer></v-spacer>

                        <!-- REGISTRAR ANOTACIÓN -->
                        <v-col cols="12" xs="12" sm="12" md="6" lg="3" xl="3">
                            <b-button class="btn-sm btn-icon w-100" variant="primary" @click="showDialogConciliacionManual()">
                                <i class="pe-7s-pen btn-icon-wrapper"></i>Conciliación Manual
                            </b-button>
                        </v-col>

                    </v-row>
                    </v-container>
                </template>
                
        </v-card>

    </div>
</template>
<script>

import { getCadenas, getLocales, getLocalesByCadena, getEmisores, getTipoTrxByEmisor, 
    getDetalleConciliacionManualByFiltro, updateEstadoConciliacionTrx } from '../services/ConcconcmanpService';
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
            ctEmisorFilterValue: 'true',
            ctFechaFilterValue: 'true',
            ctLocalFilterValue: 'true',
            ctMontoFilterValue: '',
            ctNumTarjetaFilterValue: '',
            ctCodAutorizacionFilterValue: '',

            //TABLA
            selected: [],
            tableHeaders : [
                { text: "Id Reclamo", value: "lre_reclamo"},
                { text: "Fecha", value: "trx_fecha_formateada"},
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

            // NUEVA TABLA
            listadoTrxConManual: [],
            dup_cant_trx: 0,
            dup_monto_trx: 0,
            des_cant_trx: 0,
            des_monto_trx: 0,
            cont: 0,
            cont_dup: 0,
            cont_des: 0,
            //x: 0,

            //ARRAY DE ELEMENTOS SELECCIONADOS

            listaBloquesSeleccionados: [],
            duplicadasSeleccionadas: [],
            desconocidasSeleccionadas: [],

            //MODAL CONCILIACION MANUAL
            loaderDialogConciliacionManual: false,
            dialogConciliacionManual: false,
            totalTrxDesconocidasSeleccionadas: '',
            totalTrxPrelitigioSeleccionadas: '',
            anotacionFilterValue: '',

            moneda: config.symbolMoney
        };
    },

    filters: {
    formatDate: function (value) {
      // Parsear la fecha original en un objeto Date
      var fecha = new Date(value);
      
      // Formatear la fecha como "dd-mm-yyyy"
      var dia = fecha.getDate().toString().padStart(2, '0');
      var mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
      var año = fecha.getFullYear();
      
      return dia + '-' + mes + '-' + año;
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
    },

    async mounted() {
        // CONSUME SERVICIOS
        this.loader = true;
        this.cadenas = this.cadenasAdv = await getCadenas();
        this.blocales = this.blocalesAdv = await getLocales();
        this.emisores = this.emisoresAdv = await getEmisores();
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

        /* SERVICIO OBTIENE DETALLE POR FILTROS */
        async detalleByFiltro() {
            this.desserts = [];
            this.selected = [];

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
                if (!this.emisorFilterValue) {
                    this.showWarnMsg({message: "Debe seleccionar un emisor."});
                }
                if (!this.cadenaFilterValue) {
                    this.showWarnMsg({message: "Debe seleccionar una cadena."});
                }
                
                /* OBTENER DETALLE EN BASE A FILTROS */
                if (this.startDate && this.endDate && this.emisorFilterValue && this.cadenaFilterValue) {
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
                    if (this.ctEmisorFilterValue == "" || this.ctEmisorFilterValue == null) {
                        this.ctEmisorFilterValue = false
                    }
                    if (this.ctFechaFilterValue == "" || this.ctFechaFilterValue == null) {
                        this.ctFechaFilterValue = false;
                    }
                    if (this.ctLocalFilterValue == "" || this.ctLocalFilterValue == null) {
                        this.ctLocalFilterValue = false;
                    }
                    if (this.ctMontoFilterValue == "" || this.ctMontoFilterValue == null) {
                        this.ctMontoFilterValue = false;
                    }
                    if (this.ctNumTarjetaFilterValue == "" || this.ctNumTarjetaFilterValue == null) {
                        this.ctNumTarjetaFilterValue = false;
                    }
                    if (this.ctCodAutorizacionFilterValue == "" || this.ctCodAutorizacionFilterValue == null) {
                        this.ctCodAutorizacionFilterValue = false;
                    }

                    /* const filtro = {
                        f_ini: null,
                        f_fin: null,
                        id_emisor: this.emisorFilterValue,
                        id_tipotrx: null,
                        id_cadena: this.cadenaFilterValue,
                        id_local: null,
                        ct_emisor: false,
                        ct_fecha: false,
                        ct_local: false,
                        ct_monto: false,
                        ct_numtarjeta: false,
                        ct_codautor: false,
                        
                        id_comercio: null, // DEPRECADO
                        lim_inf: null, // DEPRECADO
                        lim_sup: null, // DEPRECADO
                        trx_numtarjeta: null, // DEPRECADO
                        trx_codautor: null, // DEPRECADO
                        id_usuario: null, // DEPRECADO
                        qtydia: null, // DEPRECADO

                        ct_1dia: false, // DEPRECADO
                        ct_boleta: false, // DEPRECADO
                        ct_4dig: false, // DEPRECADO
                        ct_producto: false, // DEPRECADO
                        ct_volumen: false, // DEPRECADO
                        ct_cadena: false, // DEPRECADO
                        petrobras_ENABLED: false, // DEPRECADO

                    }; */

                    const filtro = {
                        f_ini: this.startDate,
                        f_fin: this.endDate,
                        id_emisor: this.emisorFilterValue,
                        id_tipotrx: this.tipotrxFilterValue,
                        id_cadena: this.cadenaFilterValue,
                        id_local: this.localFilterValue,
                        ct_emisor: this.ctEmisorFilterValue,
                        ct_fecha: this.ctFechaFilterValue,
                        ct_local: this.ctLocalFilterValue,
                        ct_monto: this.ctMontoFilterValue,
                        ct_numtarjeta: this.ctNumTarjetaFilterValue,
                        ct_codautor: this.ctCodAutorizacionFilterValue,
                        
                        id_comercio: null, // DEPRECADO
                        lim_inf: null, // DEPRECADO
                        lim_sup: null, // DEPRECADO
                        trx_numtarjeta: null, // DEPRECADO
                        trx_codautor: null, // DEPRECADO
                        id_usuario: null, // DEPRECADO
                        qtydia: null, // DEPRECADO

                        ct_1dia: false, // DEPRECADO
                        ct_boleta: false, // DEPRECADO
                        ct_4dig: false, // DEPRECADO
                        ct_producto: false, // DEPRECADO
                        ct_volumen: false, // DEPRECADO
                        ct_cadena: false, // DEPRECADO
                        petrobras_ENABLED: false, // DEPRECADO

                    };

                    try {
                        const listaConciliacionManual = await getDetalleConciliacionManualByFiltro(filtro);
                            this.showInfoMsg({message: "Se encontraron " + listaConciliacionManual.length + " registros."});
                            if (listaConciliacionManual.length != 0) {

                                let bloque = 0;

                                listaConciliacionManual.forEach((objConciliacionManual) => {
                                    // objCartaDeReclamo.trx_fecha_formateada = objCartaDeReclamo.trx_fecha + " " + objCartaDeReclamo.trx_hora;
                                    const listaDuplicadas = objConciliacionManual.dup;
                                    if (listaDuplicadas != 0) {
                                        listaDuplicadas.forEach((objDuplicada) => {
                                            objDuplicada.bloque = bloque;
                                        });
                                    }

                                    const listaDesconocidas = objConciliacionManual.des;
                                    if (listaDesconocidas != 0) {
                                        listaDesconocidas.forEach((objDesconocida) => {
                                            objDesconocida.bloque = bloque;
                                        });
                                    }

                                    this.desserts.push(objConciliacionManual);
                                    bloque++;
                                });
                            }
                    } catch (error) {
                        console.log(error);
                        this.showErrorMsg({message: "Hubo un error al obtener los registros."});
                    }

                } else {
                    this.showErrorMsg({message: "Por favor complete los campos requeridos."});
                }
            console.log(this.desserts);
            this.loader = false;
        },

        /* EXPORTA REGISTROS DE TABLA A PLANILLA .XLSX */
        exportarPlanilla() {
            this.loader = true;

            try {
                if (this.desserts.length > 0) {

                    const headersDesserts = {
                    'Fecha': 'Fecha',
                    'Hora': 'Hora',
                    'Cadena': 'Cadena',
                    'Local': 'Local',
                    'Emisor': 'Emisor',
                    'Tarjeta': 'Tarjeta',
                    'TipoTrx': 'TipoTrx',
                    ['Monto ' + config.symbolMoney]: 'Monto ' + config.symbolMoney,
                    'Estado': 'Estado',
                    'Num. Tarjeta': 'Num. Tarjeta',
                    'Cod. Autor': 'Cod. Autor',
                    'POS': 'POS'
                    };

                    let data = [headersDesserts];

                    this.desserts.forEach((objDesserts) => {

                        let dataDesconocida = objDesserts.des.map(row => ({
                            'Fecha': row.trx_fecha.split('T')[0],
                            'Hora': row.trx_hora.split('T')[1].substring(0, 8),
                            'Cadena': row.cad_nombre,
                            'Local': row.loc_nombre,
                            'Emisor': row.emi_nombre,
                            'Tarjeta': row.tar_nombre || 'Desconocida',
                            'TipoTrx': row.ttx_nombre,
                            ['Monto ' + config.symbolMoney]: row.trx_monto.toFixed(2),
                            'Estado': row.ecn_descripcion,
                            'Num. Tarjeta': row.trx_numtarjeta ? row.trx_numtarjeta.replace(/.(?=.{4})/g, '*') : '',
                            'Cod. Autor': row.trx_codautor,
                            'POS': row.trx_pos || ''
                        }));

                        let dataDuplicada = objDesserts.dup.map(row => ({
                            'Fecha': row.trx_fecha.split('T')[0],
                            'Hora': row.trx_hora.split('T')[1].substring(0, 8),
                            'Cadena': row.cad_nombre,
                            'Local': row.loc_nombre,
                            'Emisor': row.emi_nombre,
                            'Tarjeta': row.tar_nombre || 'Duplicada',
                            'TipoTrx': row.ttx_nombre,
                            ['Monto ' + config.symbolMoney]: row.trx_monto.toFixed(2),
                            'Estado': row.ecn_descripcion,
                            'Num. Tarjeta': row.trx_numtarjeta ? row.trx_numtarjeta.replace(/.(?=.{4})/g, '*') : '',
                            'Cod. Autor': row.trx_codautor,
                            'POS': row.trx_pos || ''
                        }));

                        data = data.concat(dataDesconocida).concat(dataDuplicada).concat({});

                    });

                    const ws = XLSX.utils.json_to_sheet(data, { skipHeader: true });
                    const wb = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(wb, ws, "Conciliacion-Manual");
                    XLSX.writeFile(wb, "conciliacion-manual.xlsx");
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

        /* MÉTODO PARA VALIDAR LAS TRX SELECCIONADAS Y MOSTRAR MODAL */
        async showDialogConciliacionManual() {

            this.listaBloquesSeleccionados = [];
            
            // CICLO PARA RECORRER LOS BLOQUES
            for (let index = 0; index < this.desserts.length; index++) {

                /* VALIDA QUE SE SELECCIONE AL MENOS 1 TRANSACCIÓN DE DUPLICADAS*/
                if (this.duplicadasSeleccionadas.length === 0) {
                    this.showWarnMsg({message: "Para conciliar manualmente debes seleccionar al menos 1 transacción en prelitigio."});
                    return;
                }

                /* VALIDA QUE SE SELECCIONE AL MENOS 1 TRANSACCIÓN DE DESCONOCIDAS*/
                if (this.desconocidasSeleccionadas.length === 0) {
                    this.showWarnMsg({message: "Para conciliar manualmente debes seleccionar al menos 1 transacción desconocida."});
                    return;
                }

                /* VALIDA QUE SE SELECCIONE SOLO 1 TRANSACCIÓN DE DUPLICADAS POR BLOQUE */
                if (this.duplicadasSeleccionadas.filter(objDuplicada => objDuplicada.bloque === index).length > 1) {
                    this.showWarnMsg({message: "Se debe seleccionar solo 1 transacción en prelitigio a conciliar por bloque."});
                    return;
                }

                /* VALIDA QUE SE SELECCIONE SOLO 1 TRANSACCIÓN DE DESCONOCIDAS POR BLOQUE */
                if (this.desconocidasSeleccionadas.filter(objDesconocida => objDesconocida.bloque === index).length > 1) {
                    this.showWarnMsg({message: "Se debe seleccionar solo 1 transacción desconocida a conciliar por bloque."});
                    return;
                }

                /* VALIDA QUE LOS MONTOS SEAN IGUALES EN LA TRANSACCION PRELITIGIO Y LA TRANSACCION DESCONOCIDA POR BLOQUE*/
                const objDuplicadaSeleccionada = this.duplicadasSeleccionadas.filter(objDuplicada => objDuplicada.bloque === index);
                const objDesconocidaSeleccionada = this.desconocidasSeleccionadas.filter(objDesconocida => objDesconocida.bloque === index);

                if (objDuplicadaSeleccionada[0].trx_monto !== objDesconocidaSeleccionada[0].trx_monto) {
                    this.showWarnMsg({message: "Los montos seleccionados entre cada transacción deben ser iguales."});
                    return;
                }

                if (objDuplicadaSeleccionada.length > 0) {
                    const objBloquesSeleccionados = {

                        objDuplicada : objDuplicadaSeleccionada[0],

                        objDesconocida : objDesconocidaSeleccionada[0]
                    };

                    this.listaBloquesSeleccionados.push(objBloquesSeleccionados);
                }

            }

            /* SETEA LOS INPUTS EN EL MODAL DE REGISTRO ANOTACION */
            let cantidadDuplicadas = 0;
            let cantidadDesconocidas = 0;
            let totalDuplicadas = 0;
            let totalDesconocidas = 0;
            this.listaBloquesSeleccionados.forEach((objBloquesSeleccionados) => {
                cantidadDuplicadas = cantidadDuplicadas + 1;
                cantidadDesconocidas = cantidadDesconocidas + 1;
                totalDuplicadas = totalDuplicadas + objBloquesSeleccionados.objDuplicada.trx_monto;
                totalDesconocidas = totalDesconocidas + objBloquesSeleccionados.objDesconocida.trx_monto;
            });

            this.totalTrxDesconocidasSeleccionadas = 0;
            this.totalTrxPrelitigioSeleccionadas = 0;

            this.totalTrxDesconocidasSeleccionadas = cantidadDesconocidas + ' (' + config.symbolMoney + ' ' + totalDesconocidas + ')';
            this.totalTrxPrelitigioSeleccionadas = cantidadDuplicadas + ' (' + config.symbolMoney + ' ' + totalDuplicadas + ')';
            this.dialogConciliacionManual = true;
        },

        /* MÉTODO PARA CERRAR DIALOG DE CONCILIACION MANUAL */
        cerrarDialogConciliacionManual() {
            this.dialogConciliacionManual = false;
        },

        /* MÉTODO PARA CONCILIAR MANUALMENTE LAS TRX SELECCIONADAS */
        async conciliarManualmenteTrxSeleccionadas() {

            if (this.anotacionFilterValue == "") {
                this.anotacionFilterValue = null;
            }

            if (this.anotacionFilterValue === null) {
                this.showWarnMsg({message: "Para conciliar manualmente debes ingresar una anotación."});
                return;
            } else {
                this.loaderDialogConciliacionManual = true;

                // RECORRE TRX SELECCIONADAS
                this.listaBloquesSeleccionados.forEach((objTrxSeleccionada) => {

                    objTrxSeleccionada.objDesconocida.anotacion = this.anotacionFilterValue;
                    objTrxSeleccionada.objDesconocida.id_usuario = 1;
                    objTrxSeleccionada.objDuplicada.anotacion = this.anotacionFilterValue;
                    objTrxSeleccionada.objDuplicada.id_usuario = 1;

                });

                // CONSUME ENDPOINT
                try {
                    const listaTRX = await updateEstadoConciliacionTrx(this.listaBloquesSeleccionados);
                    this.showInfoMsg({message: "Se actualizaron " + listaTRX.length + " Transacciones."});
                } catch (error) {
                    console.log(error);
                    this.showErrorMsg({message: "Hubo un error al actualizar las transacciones."});
                }

                // MOSTRAR FILTRO
                this.detalleByFiltro();
                this.dialogConciliacionManual = false;
                
            }

            this.loaderDialogConciliacionManual = false;

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

.scrollable-card-body {
    overflow-y: auto;
}

.scrollable-div {
    overflow-x: auto;
}

.texto7 {
	font-family: tahoma, verdana, arial;
	font-weight: normal;
	font-size: 7pt;
}

.texto_ht1 {
    font-family: "Tahoma";
    font-size: 11px;
    font-weight: bold;
    color: #000000;
}

.texto_tt1 {
    font-family: "Arial";
    font-size: 11px;
    font-weight: normal;
}

</style>