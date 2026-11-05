import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const getStoredUser = () => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

const storedUser = getStoredUser();
const hasToken = Boolean(Cookies.get("jwt_authorization"));

const initialState = {
  user: hasToken ? storedUser : null,
  isAuthenticated: Boolean(storedUser && hasToken),
};

if (!hasToken && storedUser) {
  localStorage.removeItem("user");
}

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    setCredentials(state, action) {
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },

    clearCredentials(state) {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("user");
    },
  },
});

export const {
  setCredentials,
  clearCredentials,
} = authSlice.actions;

export default authSlice.reducer;