import http from "../http-cicloguin";

class CicloguinService {
get(id) {
    return http.get(`/transa/${id}`)
}

loguin(data) {
    return http.post('/loguin', data)
}

}

export default new CicloguinService();