import axiosInstance from "../../../../core/api/axiosInstance";

const ENDPOINT = "sub-business-categories";

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

const subBusinessCategoriesService = {
  async getAll(params) {
    const response = await axiosInstance.get(ENDPOINT, { params });
    return response.data;
  },
  async create(data) {
    const response = await axiosInstance.post(ENDPOINT, data);
    return ensureSuccess(
      response.data,
      "Unable to create sub business category."
    );
  },
  async update(uuid, data) {
    const response = await axiosInstance.put(`${ENDPOINT}/${uuid}`, data);
    return ensureSuccess(
      response.data,
      "Unable to update sub business category."
    );
  },
  async delete(uuid) {
    const response = await axiosInstance.delete(`${ENDPOINT}/${uuid}`);
    return ensureSuccess(
      response.data,
      "Unable to deactivate sub business category."
    );
  },
  async importFile(file) {
    const formData = new FormData();
    formData.append("import_excel_file", file);
    const response = await axiosInstance.post(`${ENDPOINT}/import`, formData);
    return ensureSuccess(
      response.data,
      "Unable to import sub business categories."
    );
  },
};

export default subBusinessCategoriesService;
