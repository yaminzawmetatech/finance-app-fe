import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeCompany: null,
  activeModules: [],
  subscriptionLoaded: false,
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
    },

    clearCompanyContext(state) {
      state.activeCompany = null;
      state.activeModules = [];
      state.subscriptionLoaded = false;
    },
  },
});

export const {
  setCompanyContext,
  clearCompanyContext,
} = companySlice.actions;

export default companySlice.reducer;