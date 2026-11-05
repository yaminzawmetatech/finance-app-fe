import axiosInstance from "../../../core/api/axiosInstance";

const ENDPOINTS = {
  states: "nrc-states",
  townships: "nrc-townships",
};

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

const getList = async (resource) => {
  const response = await axiosInstance.get(ENDPOINTS[resource]);
  return response.data;
};

const create = async (resource, data) => {
  const response = await axiosInstance.post(ENDPOINTS[resource], data);
  return ensureSuccess(response.data, `Unable to create NRC ${resource}.`);
};

const update = async (resource, uuid, data) => {
  const response = await axiosInstance.put(
    `${ENDPOINTS[resource]}/${uuid}`,
    data
  );
  return ensureSuccess(response.data, `Unable to update NRC ${resource}.`);
};

const remove = async (resource, uuid) => {
  const response = await axiosInstance.delete(
    `${ENDPOINTS[resource]}/${uuid}`
  );
  return ensureSuccess(response.data, `Unable to delete NRC ${resource}.`);
};

const batchRemove = async (resource, uuids) => {
  const response = await axiosInstance.post(
    `${ENDPOINTS[resource]}/batch-delete`,
    uuids
  );
  return ensureSuccess(
    response.data,
    `Unable to delete selected NRC ${resource}.`
  );
};

const importFile = async (resource, file) => {
  const formData = new FormData();
  formData.append("import_excel_file", file);
  const response = await axiosInstance.post(
    `${ENDPOINTS[resource]}/import`,
    formData
  );
  return ensureSuccess(response.data, `Unable to import NRC ${resource}.`);
};

const nrcService = {
  getStates: () => getList("states"),
  getTownships: () => getList("townships"),
  createState: (data) => create("states", data),
  updateState: (uuid, data) => update("states", uuid, data),
  deleteState: (uuid) => remove("states", uuid),
  batchDeleteStates: (uuids) => batchRemove("states", uuids),
  importStates: (file) => importFile("states", file),
  createTownship: (data) => create("townships", data),
  updateTownship: (uuid, data) => update("townships", uuid, data),
  deleteTownship: (uuid) => remove("townships", uuid),
  batchDeleteTownships: (uuids) => batchRemove("townships", uuids),
  importTownships: (file) => importFile("townships", file),
};

export default nrcService;
