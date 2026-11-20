import axiosInstance from "../../../../core/api/axiosInstance";

const ENDPOINT = "blacklist-customers";

const ensureSuccess = (data, fallback) => {
  if (data === false || data === 500 || data?.success === false) {
    const message = data?.message;
    const detail =
      typeof message === "string"
        ? message
        : message && typeof message === "object"
          ? Object.values(message)
              .flat()
              .join(" ")
          : fallback;
    throw new Error(detail || fallback);
  }
  return data;
};

const blacklistCustomersService = {
  async getAll(params) {
    const response = await axiosInstance.get(ENDPOINT, { params });
    return response.data;
  },
  async create(data) {
    const response = await axiosInstance.post(ENDPOINT, data);
    return ensureSuccess(response.data, "Unable to create blacklist customer.");
  },
  async update(uuid, data) {
    const response = await axiosInstance.put(`${ENDPOINT}/${uuid}`, data);
    return ensureSuccess(response.data, "Unable to update blacklist customer.");
  },
  async delete(uuid) {
    const response = await axiosInstance.delete(`${ENDPOINT}/${uuid}`);
    return ensureSuccess(response.data, "Unable to delete blacklist customer.");
  },
  async batchDelete(uuids) {
    const response = await axiosInstance.post(`${ENDPOINT}/batch-delete`, uuids);
    return ensureSuccess(
      response.data,
      "Unable to delete selected blacklist customers."
    );
  },
  async importFile(file) {
    const formData = new FormData();
    formData.append("import_excel_file", file);
    const response = await axiosInstance.post(`${ENDPOINT}/import`, formData);
    return ensureSuccess(response.data, "Unable to import blacklist customers.");
  },
  async getNrcRemarks() {
    const response = await axiosInstance.get("blacklist-customer-nrc-remarks");
    return response.data;
  },
};

export default blacklistCustomersService;
