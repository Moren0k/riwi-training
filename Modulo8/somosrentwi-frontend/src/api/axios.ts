import axios from "axios";

export const api = axios.create({
  baseURL: "https://somosrentwi-backend-production.up.railway.app/api",
});
