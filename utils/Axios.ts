import axios from "axios";

export const Axios = axios.create({
  baseURL: "https://api.kolkataff.space",
  timeout: 50000,
});
