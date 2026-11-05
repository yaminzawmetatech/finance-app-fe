import axiosInstance from "../../../core/api/axiosInstance";

const POSITIONS_ENDPOINT = "positions";

const ensureSuccess = (data, message) => {
  if (data === false || data === 500 || data?.success === false) {
    const details = data?.message;
    const errorMessage =
      typeof details === "string"
        ? details
        : details && typeof details === "object"
          ? Object.values(details).flat().join(" ")
          : message;
    throw new Error(errorMessage || message);
  }
  return data;
};

const getPositions = async () => {
  const response = await axiosInstance.get(POSITIONS_ENDPOINT);
  return response.data;
};

const createPosition = async (data) => {
  const response = await axiosInstance.post(POSITIONS_ENDPOINT, data);
  return ensureSuccess(response.data, "Unable to create position.");
};

const updatePosition = async (uuid, data) => {
  const response = await axiosInstance.put(
    `${POSITIONS_ENDPOINT}/${uuid}`,
    data
  );
  return ensureSuccess(response.data, "Unable to update position.");
};

const deletePosition = async (uuid) => {
  const response = await axiosInstance.delete(
    `${POSITIONS_ENDPOINT}/${uuid}`
  );
  return ensureSuccess(response.data, "Unable to delete position.");
};

const positionsService = {
  getPositions,
  createPosition,
  updatePosition,
  deletePosition,
};

export default positionsService;
