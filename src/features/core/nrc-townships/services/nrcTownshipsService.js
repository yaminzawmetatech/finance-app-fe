import axiosInstance from "../../../../core/api/axiosInstance";

const ENDPOINT = "nrc-townships";

const formatApiMessage = (message) => {
  if (typeof message === "string") return message;
  if (message && typeof message === "object") {
    return Object.entries(message)
      .flatMap(([field, messages]) =>
        (Array.isArray(messages) ? messages : [messages]).map(
          (item) => `${field}: ${item}`
        )
      )
      .join("\n");
  }
  return "";
};

const ensureSuccess = (data, fallback) => {
  if (data === false || data === 500 || data?.success === false) {
    throw new Error(formatApiMessage(data?.message) || fallback);
  }
  return data;
};

const getTownships = async () => {
  const response = await axiosInstance.get(ENDPOINT);
  return response.data;
};

const createTownship = async (data) => {
  const response = await axiosInstance.post(ENDPOINT, data);
  return ensureSuccess(response.data, "Unable to create NRC township.");
};

const updateTownship = async (uuid, data) => {
  const response = await axiosInstance.put(`${ENDPOINT}/${uuid}`, data);
  return ensureSuccess(response.data, "Unable to update NRC township.");
};

const deleteTownship = async (uuid) => {
  const response = await axiosInstance.delete(`${ENDPOINT}/${uuid}`);
  return ensureSuccess(response.data, "Unable to delete NRC township.");
};

const batchDeleteTownships = async (uuids) => {
  const response = await axiosInstance.post(`${ENDPOINT}/batch-delete`, uuids);
  return ensureSuccess(
    response.data,
    "Unable to delete selected NRC townships."
  );
};

const importTownships = async (file) => {
  const formData = new FormData();
  formData.append("import_excel_file", file);
  const response = await axiosInstance.post(`${ENDPOINT}/import`, formData);
  return ensureSuccess(response.data, "Unable to import NRC townships.");
};

const nrcTownshipsService = {
  getTownships,
  createTownship,
  updateTownship,
  deleteTownship,
  batchDeleteTownships,
  importTownships,
};

export default nrcTownshipsService;
