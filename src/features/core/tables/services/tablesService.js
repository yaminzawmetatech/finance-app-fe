import axiosInstance from "../../../../core/api/axiosInstance";

const ENDPOINT = "tables";

const ensureSuccess = (data, fallback) => {
  if (data === false || data === 500 || data?.success === false) {
    const message = data?.message;
    throw new Error(typeof message === "string" ? message : fallback);
  }
  return data;
};

const tablesService = {
  async getAll(params) {
    const response = await axiosInstance.get(ENDPOINT, { params });
    return response.data;
  },
  async create(data) {
    const response = await axiosInstance.post(ENDPOINT, data);
    return ensureSuccess(response.data, "Unable to create table.");
  },
  async update(uuid, data) {
    const response = await axiosInstance.put(`${ENDPOINT}/${uuid}`, data);
    return ensureSuccess(response.data, "Unable to update table.");
  },
  async delete(uuid) {
    const response = await axiosInstance.delete(`${ENDPOINT}/${uuid}`);
    return ensureSuccess(response.data, "Unable to delete table.");
  },
  async batchDelete(uuids) {
    const response = await axiosInstance.post(`${ENDPOINT}/batch-delete`, uuids);
    return ensureSuccess(response.data, "Unable to delete selected tables.");
  },
};

export default tablesService;
