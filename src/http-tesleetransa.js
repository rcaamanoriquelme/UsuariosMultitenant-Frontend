import axios from "axios";

export default axios.create({

   baseURL: "http://localhost:8090/api",

// Desarrollo:
//    baseURL: "http://10.200.145.176:8080/dbirs_aud_leecontrolenvio/api",

// QA
//	baseURL: "http://monitor.as1.test.cic.sdt:8080/dbirs_aud_leecontrolenvio/api",

// Produccion:
//   baseURL: "http://10.200.45.235:8080/dbirs_aud_leecontrolenvio/api",

// Produccion:
//   baseURL: "http://10.200.45.245:8080/dbirs_aud_leecontrolenvio/api",
   
  headers: {
    "Content-type": "application/json"
  }
});
