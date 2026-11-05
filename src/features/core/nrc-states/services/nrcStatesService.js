import axiosInstance from "../../../../core/api/axiosInstance";

const ENDPOINT = "nrc-states";

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

const getStates = async () => {
  const response = await axiosInstance.get(ENDPOINT);
  return response.data;
};

const createState = async (data) => {
  const response = await axiosInstance.post(ENDPOINT, data);
  return ensureSuccess(response.data, "Unable to create NRC state.");
};

const updateState = async (uuid, data) => {
  const response = await axiosInstance.put(`${ENDPOINT}/${uuid}`, data);
  return ensureSuccess(response.data, "Unable to update NRC state.");
};

const deleteState = async (uuid) => {
  const response = await axiosInstance.delete(`${ENDPOINT}/${uuid}`);
  return ensureSuccess(response.data, "Unable to delete NRC state.");
};

const batchDeleteStates = async (uuids) => {
  const response = await axiosInstance.post(`${ENDPOINT}/batch-delete`, uuids);
  return ensureSuccess(response.data, "Unable to delete selected NRC states.");
};

const importStates = async (file) => {
  const formData = new FormData();
  formData.append("import_excel_file", file);
  const response = await axiosInstance.post(`${ENDPOINT}/import`, formData);
  return ensureSuccess(response.data, "Unable to import NRC states.");
};

const nrcStatesService = {
  getStates,
  createState,
  updateState,
  deleteState,
  batchDeleteStates,
  importStates,
};

export default nrcStatesService;
