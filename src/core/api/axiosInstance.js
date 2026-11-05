
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

const baseURL =
  import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
    baseURL,
});

axiosInstance.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

axiosInstance.interceptors.request.use(
  async (config) => {
    if (!baseURL) {
      return Promise.reject(new Error("VITE_API_URL is not configured."));
    }

    try {
      const token = Cookies.get("jwt_authorization");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      toast.error(error.message);  
    }
    return config;
  },
  (error) => {
    toast.error(error.message);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    
    if (!error?.response?.status) {
      toast.error(error?.message);
    } else if (error?.response?.status === 401) {
      Cookies.remove("jwt_authorization");
      localStorage.removeItem("user");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    } else if (error?.response?.status === 422) {
      let errorResponse = error.response.data.message;
      for (const key in errorResponse) {
        if (errorResponse.hasOwnProperty(key)) {
          toast.error(errorResponse[key][0]);
        }
      }
    } else if (error?.response?.status && error?.response?.data?.message) {
      toast.error(error?.response?.data?.message);
    } else {
      toast.error(error?.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
