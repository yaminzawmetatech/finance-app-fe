import axiosInstance from "../../../../core/api/axiosInstance";

const USER_GROUPS_ENDPOINT = "user-groups";
const PERMISSIONS_ENDPOINT = "permissions";

const ensureSuccess = (data, message) => {
  if (data === false || data === 500 || data?.success === false) {
    throw new Error(message);
  }
  return data;
};

const getUserGroups = async () => {
  const response = await axiosInstance.get(USER_GROUPS_ENDPOINT);
  return response.data;
};

const createUserGroup = async (data) => {
  const response = await axiosInstance.post(USER_GROUPS_ENDPOINT, data);
  return ensureSuccess(response.data, "Unable to create user group.");
};

const updateUserGroup = async (uuid, data) => {
  const response = await axiosInstance.put(
    `${USER_GROUPS_ENDPOINT}/${uuid}`,
    data
  );
  return ensureSuccess(response.data, "Unable to update user group.");
};

const deleteUserGroup = async (uuid) => {
  const response = await axiosInstance.delete(
    `${USER_GROUPS_ENDPOINT}/${uuid}`
  );
  return ensureSuccess(response.data, "Unable to delete user group.");
};

const getPermissions = async () => {
  const response = await axiosInstance.get(PERMISSIONS_ENDPOINT);
  return response.data;
};

const userGroupsService = {
  getUserGroups,
  createUserGroup,
  updateUserGroup,
  deleteUserGroup,
  getPermissions,
};

export default userGroupsService;
