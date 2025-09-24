import { api } from "./api";

export const listTasks   = () => api("/tasks");
export const createTask  = (payload) =>
  api("/tasks", { method: "POST", body: JSON.stringify(payload) });
export const updateTask  = (id, payload) =>
  api(`/tasks/${id}`, { method: "PUT", body: JSON.stringify(payload) });
export const toggleTask  = (id) => api(`/tasks/${id}/toggle`, { method: "PATCH" });
export const deleteTask  = (id) => api(`/tasks/${id}`, { method: "DELETE" });
export const getSummary  = () => api("/tasks/stats/summary");
