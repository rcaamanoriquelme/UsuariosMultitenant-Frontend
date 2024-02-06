import axios from "axios";

const ENDPOINT_PATH = "https://reqres.in/api/";

export default {

  register(email, password) {
    const user = { email, password };
    return axios.post(ENDPOINT_PATH + "regiser", user);
  },
  login(email, password) {
    const user = { email, password };
    console.log("Params user: ",user);
    return axios.post(ENDPOINT_PATH + "login", user);
  }
};
