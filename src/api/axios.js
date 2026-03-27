import axios from "axios";

const instance = axios.create({
  baseURL: "http://25.2.109.64:8080",
});

export default instance;