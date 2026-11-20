import axiosInstance from "../../../../core/api/axiosInstance";

const ENDPOINT = "main-business-categories";

const ensureSuccess = (data, fallback) => {
  if (data === false || data === 500 || data?.success === false) {
    const message = data?.message;
    const detail =
      typeof message === "string"
        ? message
        : message && typeof message === "object"
          ? Object.values(message).flat().join(" ")
          : fallback;
    throw new Error(detail || fallback);
  }
  return data;
};

const mainBusinessCategoriesService = {
  async getAll(params) {
    const response = await axiosInstance.get(ENDPOINT, { params });
    return response.data;
  },
  async create(data) {
    const response = await axiosInstance.post(ENDPOINT, data);
    return ensureSuccess(
      response.data,
      "Unable to create main business category."
    );
  },
  async update(uuid, data) {
    const response = await axiosInstance.put(`${ENDPOINT}/${uuid}`, data);
    return ensureSuccess(
      response.data,
      "Unable to update main business category."
    );
  },
  async delete(uuid) {
    const response = await axiosInstance.delete(`${ENDPOINT}/${uuid}`);
    return ensureSuccess(
      response.data,
      "Unable to deactivate main business category."
    );
  },
  async batchDelete(uuids) {
    const response = await axiosInstance.post(
      `${ENDPOINT}/batch-delete`,
      uuids
    );
    return ensureSuccess(
      response.data,
      "Unable to deactivate selected main business categories."
    );
  },
  async importFile(file) {
    const formData = new FormData();
    formData.append("import_excel_file", file);
    const response = await axiosInstance.post(`${ENDPOINT}/import`, formData);
    return ensureSuccess(
      response.data,
      "Unable to import main business categories."
    );
  },
};

export default mainBusinessCategoriesService;
