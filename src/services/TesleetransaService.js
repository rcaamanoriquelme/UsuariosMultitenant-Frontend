import http from "../http-tesleetransa";

class TesleetransaService {
getAll(data) {
    return http.post('/local', data)
}

getDocumento(data) {
    return http.get('/documentoleer', data)
}

get(id) {
    return http.get(`/transa/${id}`)
}

create(data) {
    return http.post('/customers', data)
}

update(id, data) {
    return http.put(`/updatetransa/${id}`, data)
}

updateEstado(data) {
    return http.put('/estadoupt', data)
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

export default new TesleetransaService();