import axiosInstance from "../../../core/api/axiosInstance";

const DEPARTMENTS_ENDPOINT = "departments";

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

const getDepartments = async () => {
  const response = await axiosInstance.get(DEPARTMENTS_ENDPOINT);
  return response.data;
};

const createDepartment = async (data) => {
  const response = await axiosInstance.post(DEPARTMENTS_ENDPOINT, data);
  return ensureSuccess(response.data, "Unable to create department.");
};

const updateDepartment = async (uuid, data) => {
  const response = await axiosInstance.put(
    `${DEPARTMENTS_ENDPOINT}/${uuid}`,
    data
  );
  return ensureSuccess(response.data, "Unable to update department.");
};

const deleteDepartment = async (uuid) => {
  const response = await axiosInstance.delete(
    `${DEPARTMENTS_ENDPOINT}/${uuid}`
  );
  return ensureSuccess(response.data, "Unable to delete department.");
};

const batchDeleteDepartments = async (uuids) => {
  const response = await axiosInstance.post(
    `${DEPARTMENTS_ENDPOINT}/batch-delete`,
    uuids
  );
  return ensureSuccess(response.data, "Unable to delete selected departments.");
};

const departmentsService = {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  batchDeleteDepartments,
};

export default departmentsService;
