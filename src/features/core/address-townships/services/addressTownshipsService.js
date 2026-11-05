import axiosInstance from "../../../../core/api/axiosInstance";

const ENDPOINT = "address-townships";

const addressTownshipsService = {
  async getAll(params) {
    const response = await axiosInstance.get(ENDPOINT, { params });
    return response.data;
  },
  async create(data) {
    const response = await axiosInstance.post(ENDPOINT, data);
    return response.data;
  },
  async update(uuid, data) {
    const response = await axiosInstance.put(`${ENDPOINT}/${uuid}`, data);
    return response.data;
  },
  async delete(uuid) {
    const response = await axiosInstance.delete(`${ENDPOINT}/${uuid}`);
    return response.data;
  },
  async batchDelete(uuids) {
    const response = await axiosInstance.post(`${ENDPOINT}/batch-delete`, uuids);
    return response.data;
  },
  async importFile(file) {
    const formData = new FormData();
    formData.append("import_excel_file", file);
    const response = await axiosInstance.post(
      `${ENDPOINT}/importAddressTownship`,
      formData
    );
    return response.data;
  },
};

export default addressTownshipsService;
