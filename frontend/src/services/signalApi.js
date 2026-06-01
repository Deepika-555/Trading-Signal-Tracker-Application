import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api/signals",
});

export const createSignal = (data) => API.post("/", data);

export const getSignals = () => API.get("/");

export const getSignalStatus = (id) =>
  API.get(`/${id}/status`);

export const deleteSignal = (id) =>
  API.delete(`/${id}`);