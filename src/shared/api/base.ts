import axios from "axios";
import { BASE_URL } from "../config/base-api";

export const api = axios.create({
  baseURL: BASE_URL
})