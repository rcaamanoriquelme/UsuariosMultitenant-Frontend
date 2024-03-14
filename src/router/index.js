import Vue from 'vue'
import Router from 'vue-router'
import DetalleFechaHome from '@/CyL/DetalleFechaHome.vue'; 
//import store from "../store";

Vue.use(Router);

export default new Router({
    scrollBehavior() {
        return window.scrollTo({ top: 0, behavior: 'smooth' });
    },
//    mode: "history",
    routes: [

        // Dashboards
        {
            path: '/CyL/Product',
            name: 'Home',
            component: () => import('../CyL/Product.vue'),
        },
        // Login
        {
            path: '/',
            name: 'login-boxed',
            meta: { layout: 'userpages' },
            component: () => import('../CyL/LoginBoxed.vue'),
        },
        // Consultas

        {
            path: '/CyL/constranco',
            name: 'transacciones comercio',
            component: () => import('../CyL/constranco.vue'),
        },

        
        {
            path: '/CyL/consestgen',
            name: 'Estadisticas Generales',
            component: () => import('../CyL/consestgen.vue'),
        },
        {
            path: '/CyL/consvenmen',
            name: 'Ventas Mensuales',
            component: () => import('../CyL/consvenmen.vue'),
        },
        {
            path: '/CyL/conspedncon',
            name: 'Pedidos no Conciliados',
            component: () => import('../CyL/conspedncon.vue'),
        },
/*
        // Conciliacion
*/       
        {
            path: '/CyL/concmoncon',
            name: 'monitor de conciliacion',
            component: () => import('../CyL/concmoncon.vue'),
        },
/*
        {
            path: '/CyL/conccontran',
            name: 'consulta transacciones',
            component: () => import('../CyL/conccontran.vue'),
        },
/*
        
        */
        {
            path: '/CyL/concconcman',
            name: 'conciliacion manual',
            component: () => import('../CyL/concconcman.vue'),
        },
        
        {
            path: '/CyL/conccoavtran',
            name: 'consulta avanzada transacciones',
            component: () => import('../CyL/conccoavtran.vue'),
        },
        
        {
            path: '/CyL/concmonconc',
            name: 'monitor de conciliacion',
            component: () => import('../CyL/concmonconc.vue'),
        },
        {
            path: '/CyL/conccontranp',
            name: 'consulta transacciones',
            component: () => import('../CyL/conccontranp.vue'),
        },
        {
            path: '/CyL/concconmanp',
            name: 'conciliacion manual',
            component: () => import('../CyL/concconmanp.vue'),
        },
        /*
        
       
        // Informes

        */
       
        {
            path: '/CyL/infoliquida',
            name: 'liquidacion',
            component: () => import('../CyL/infoliquida.vue'),
        },
       

        {
            path: '/CyL/infosalvige',
            name: 'Saldo Vigente',
            component: () => import('../CyL/infosalvige.vue'),
        },
        {
            path: '/CyL/infovales',
            name: 'vales',
            component: () => import('../CyL/infovales.vue'),
        },
          
        {
            path: '/CyL/infomedpag',
            name: 'medios de pago',
            component: () => import('../CyL/infomedpag.vue'),
        },
        
        {
            path: '/CyL/infopagserv',
            name: 'pago de servicios',
            component: () => import('../CyL/infopagserv.vue'),
        },
        {
            path: '/CyL/infotaroh',
            name: 'tarjeta oh!',
            component: () => import('../CyL/infotaroh.vue'),
        },
        
        {
            path: '/CyL/infocarrec',
            name: 'carta de reclamo',
            component: () => import('../CyL/infocarrec.vue'),
        },
        {
            path: '/CyL/infotrxncon',
            name: 'Trx no Conciliadas',
            component: () => import('../CyL/infotrxncon.vue'),
        },
        /*
        // Monitor

        */
        {
            path: '/CyL/montraemp',
            name: 'transacciones error medio de pagos',
            component: () => import('../CyL/montraemp.vue'),
        },
        
       

        {
            path: '/CyL/montraemps',
            name: 'transacciones error medio pago servicios',
            component: () => import('../CyL/montraemps.vue'),
        },

        

        {
            path: '/CyL/monrepmoar',
            name: 'reporte monitorero de archivos',
            component: () => import('../CyL/monrepmoar.vue'),
        },
        
        
        // Administracion
        {
            path: '/CyL/admusuarios',
            name: 'usuarios',
            component: () => import('../CyL/admusuarios.vue'),
        },
        {
            path: '/CyL/admlocales',
            name: 'locales',
            component: () => import('../CyL/admlocales.vue'),
        },
        {
            path: '/CyL/admlocalsave',
            name: 'localessave',
            component: () => import('../CyL/admlocalessave.vue'),
        },
        {
            path: '/CyL/admoperadores',
            name: 'operadores',
            component: () => import('../CyL/admoperadores.vue'),
        },
        {
            path: '/CyL/admoperadorsave',
            name: 'operadoressave',
            component: () => import('../CyL/admoperadoressave.vue'),
        },
        {
            path: '/CyL/admemisores',
            name: 'emisores',
            component: () => import('../CyL/admemisores.vue'),
        },
        {
            path: '/CyL/admemisorsave',
            name: 'emisoressave',
            component: () => import('../CyL/admemisoressave.vue'),
        },
        {
            path: '/CyL/admusuariossave',
            name: 'usuariossave',
            component: () => import('../CyL/admusuariossave.vue'),
        },
        /*
        {
            path: '/CyL/admusupcad',
            name: 'usuarios por cadena',
            component: () => import('../CyL/admusupcad.vue'),
        },

        {
            path: '/CyL/admemisores',
            name: 'emisores',
            component: () => import('../CyL/admemisores.vue'),
        },
        {
            path: '/CyL/admoperador',
            name: 'operadores',
            component: () => import('../CyL/admoperador.vue'),
        },

        {
            path: '/CyL/admlocales',
            name: 'locales',
            component: () => import('../CyL/admlocales.vue'),
        },

        {
            path: '/CyL/admlocconc',
            name: 'locales conciliados',
            component: () => import('../CyL/admlocconc.vue'),
        },
        {
            path: '/CyL/admmedipag',
            name: 'medios de pago',
            component: () => import('../CyL/admmedipag.vue'),
        },

        {
            path: '/CyL/admmedipemi',
            name: 'mp por emisor',
            component: () => import('../CyL/admmedipemi.vue'),
        },

        {
            path: '/CyL/admtipocuad',
            name: 'tipo cuadratura',
            component: () => import('../CyL/admtipocuad.vue'),
        },        
        {
            path: '/CyL/admcomercio',
            name: 'comercios',
            component: () => import('../CyL/admcomercio.vue'),
        },

        {
            path: '/CyL/admcadenas',
            name: 'cadenas',
            component: () => import('../CyL/admcadenas.vue'),
        },

        {
            path: '/CyL/admtrxtodos',
            name: 'todos',
            component: () => import('../CyL/admtrxtodos.vue'),
        },
        {
            path: '/CyL/admtrxpemi',
            name: 'por emisor',
            component: () => import('../CyL/admtrxpemi.vue'),
        },

        {
            path: '/CyL/admtrxnormal',
            name: 'normal',
            component: () => import('../CyL/admtrxnormal.vue'),
        },

        {
            path: '/CyL/admtrxcerror',
            name: 'con error',
            component: () => import('../CyL/admtrxcerror.vue'),
        },
        {
            path: '/CyL/admbancos',
            name: 'bancos',
            component: () => import('../CyL/admbancos.vue'),
        },

        {
            path: '/CyL/admcuecorri',
            name: 'cuentas corrientes',
            component: () => import('../CyL/admcuecorri.vue'),
        },

        {
            path: '/CyL/admusuarior',
            name: 'usuarios',
            component: () => import('../CyL/admusuarior.vue'),
        }, 
        {
            path: '/CyL/admoperadorr',
            name: 'operadores',
            component: () => import('../CyL/admoperadorr.vue'),
        },
        {
            path: '/CyL/admtexto',
            name: ' texto',
            component: () => import('../CyL/admtexto.vue'),
        },

        {
            path: '/CyL/admigv',
            name: 'igv',
            component: () => import('../CyL/admigv.vue'),
        },

        {
            path: '/CyL/admarcopera',
            name: 'archivos operador',
            component: () => import('../CyL/admarcopera.vue'),
        }, 
*/

        {
            path: '/detalle-fecha/:fecha/:idCadena',
            name: 'DetalleFechaHome',
            component: DetalleFechaHome,
            props: true,
        }
    ],
})
