import http from "../http-teslocalesservice";

class TeslocalesService {
getAll() {
    return http.get('/local')
}

getRegiones() {
  return http.get('/regiones')
}

get(id) {
    return http.get(`/tramas/${id}`)
}

create(data) {
    return http.post('/localescrea', data)
}

update(data) {
    return http.put('/localesupt', data)
}

delete(id) {
    return http.delete(`/customers/${id}`)
}

/*  
  getAll() {
    return http.get("/list_trx_error");
  }

  get(id) {
    return http.get(`/list_trx_error/${id}`);
  }

  create(data) {
    return http.post("/list_trx_error", data);
  }

  update(id, data) {
    return http.put(`/list_trx_error/${id}`, data);
  }

  delete(id) {
    return http.delete(`/list_trx_error/${id}`);
  }

  deleteAll() {
    return http.delete(`/list_trx_error`);
  }

  findByTitle(dete_desc) {
    return http.get(`/list_trx_error?dete_desc=${dete_desc}`);
  }
*/
}

export default new TeslocalesService();