import axios from "axios";
import { globalNavigate } from "./App";

export const API_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

api.interceptors.response.use(response => response, error => {
  if (globalNavigate) {
    if (error.response?.status == 401 && location.pathname !== '/') {
      globalNavigate('/login');
    }
    else if (error.response?.status == 403) {
      globalNavigate('/forbidden');
    }
  }
  return Promise.reject(error);
})