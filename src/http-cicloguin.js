import axios from "axios";

export default axios.create({

//   baseURL: "http://localhost:8099/api",

// Desarrollo:
//   baseURL: "http://10.200.145.176:8080/dbirs_tienda_login/api",

// QA
//	baseURL: "http://monitor.as1.test.cic.sdt:8080/dbirs_tienda_login/api",

// Produccion:
//   baseURL: "http://10.200.45.235:8080/dbirs_tienda_login/api",

// Produccion:
   baseURL: "http://10.200.45.245:8080/dbirs_tienda_login/api",
   
  headers: {
    "Content-type": "application/json"
  }
});
