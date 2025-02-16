import axios from "axios";

export const Axios = axios.create({
  baseURL: "https://api.kolkataff.vip",
  timeout: 50000,
});
