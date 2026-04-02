import axios from "axios";

const instance = axios.create({
  baseURL: "http://25.2.125.100:8080",
});

export default instance;