import axios from "axios";

export default axios.create({

//    baseURL: "http://localhost:8090/api",

//    baseURL: "http://localhost:8080/focus-tramas-error-api/api", Tomcat Local

//    Producion:
//    baseURL: "http://10.201.5.53:8080/focus_tramas_error_api/api",

//    Desarrollo:
//	    baseURL: "http://10.200.145.168:8080/focus_tramas_error_api/api",

//      baseURL: "http://10.201.5.53:8080/focus_tramas_error_api/api",
      baseURL: "https://forusmonitor.bbr.cl/focus_tramas_error_api/api",

//    QA:
//baseURL: "http://10.200.145.174:8080/focus_tramas_error_api/api",

  headers: {
    "Content-type": "application/json"
  }
});
