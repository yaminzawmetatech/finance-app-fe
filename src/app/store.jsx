import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth/slices/authSlice";
import companyReducer from "../features/subscriptions/slices/companySlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    company: companyReducer,
  },
});