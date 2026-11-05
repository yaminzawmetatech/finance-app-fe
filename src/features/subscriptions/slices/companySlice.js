import { createSlice } from "@reduxjs/toolkit";

const getStoredContext = () => {
  try {
    const stored = localStorage.getItem("company_context");
    return stored ? JSON.parse(stored) : null;
  } catch {
    localStorage.removeItem("company_context");
    return null;
  }
};

const storedContext = getStoredContext();

const initialState = {
  activeCompany: storedContext?.activeCompany ?? null,
  activeModules: storedContext?.activeModules ?? [],
  subscriptionLoaded: Boolean(storedContext),
};

const companySlice = createSlice({
  name: "company",
  initialState,

  reducers: {
    setCompanyContext(state, action) {
      const { company, modules } = action.payload;

      state.activeCompany = company;
      state.activeModules = modules;
      state.subscriptionLoaded = true;
      localStorage.setItem(
        "company_context",
        JSON.stringify({ activeCompany: company, activeModules: modules })
      );
    },

    clearCompanyContext(state) {
      state.activeCompany = null;
      state.activeModules = [];
      state.subscriptionLoaded = false;
      localStorage.removeItem("company_context");
    },
  },
});

export const {
  setCompanyContext,
  clearCompanyContext,
} = companySlice.actions;

export default companySlice.reducer;