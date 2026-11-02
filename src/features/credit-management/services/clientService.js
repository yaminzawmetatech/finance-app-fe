import apiClient from "../../../services/apiClient";

const BASE_URL = "/credit-management/clients";

export const clientService = {
  getAll(params = {}) {
    return apiClient.get(BASE_URL, { params });
  },

  getById(id) {
    return apiClient.get(`${BASE_URL}/${id}`);
  },

  create(data) {
    return apiClient.post(BASE_URL, data);
  },

  update(id, data) {
    return apiClient.put(`${BASE_URL}/${id}`, data);
  },

  delete(id) {
    return apiClient.delete(`${BASE_URL}/${id}`);
  },
};