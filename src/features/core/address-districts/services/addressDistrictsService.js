import axiosInstance from "../../../../core/api/axiosInstance";

const ENDPOINT = "address-districts";

const addressDistrictsService = {
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
      `${ENDPOINT}/importAddressDistrict`,
      formData
    );
    return response.data;
  },
  async getByStateAndTownship(address_state_id, address_township_id) {
    const response = await axiosInstance.post(
      "address-districts-by-state-township",
      { address_state_id, address_township_id }
    );
    return response.data;
  },
};

export default addressDistrictsService;
