import Cookies from "js-cookie";
import axiosInstance from "../../../core/api/axiosInstance";

const SESSION_USER_KEY = "user";
const TOKEN_COOKIE = "jwt_authorization";

const getResponseData = (response) => response?.data?.data ?? response?.data;

const normalizePermissions = (permissions) => {
  if (Array.isArray(permissions)) return permissions;
  if (typeof permissions === "string" && permissions.startsWith("[")) {
    try {
      const parsed = JSON.parse(permissions);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

const login = async (personal_email, password) => {
  try {
    const response = await axiosInstance.post("login", {
      personal_email: personal_email.trim(),
      password,
    });
    const data = getResponseData(response);

    if (!data?.access_token) {
      throw new Error("The login response did not include an access token.");
    }

    const user = {
      id: data.id,
      uuid: data.uuid,
      name: data.username,
      email: personal_email.trim(),
      user_group: data.user_group,
      customer_web_user_group: data.customer_web_user_group,
      permissions: normalizePermissions(data.permissions),
      workFlows: data.workFlows ?? [],
      department_id: data.department_id,
      is_super: data.is_super === true || data.is_super === 1,
    };

    Cookies.set(TOKEN_COOKIE, data.access_token, {
      sameSite: "strict",
      secure: window.location.protocol === "https:",
    });
    localStorage.setItem(SESSION_USER_KEY, JSON.stringify(user));

    return user;
  } catch (error) {
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      "Unable to log in.";
    throw new Error(message, { cause: error });
  }
};

const logout = async () => {
  try {
    await axiosInstance.post("logout");
  } finally {
    Cookies.remove(TOKEN_COOKIE);
    localStorage.removeItem(SESSION_USER_KEY);
  }
};

const authService = { login, logout };

export default authService;