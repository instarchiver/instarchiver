import axios from "axios";

const api = axios.create({
  baseURL: "https://api.instarchiver.net",
});

export default api;
