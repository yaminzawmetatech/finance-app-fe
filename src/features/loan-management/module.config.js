// modules/loan-management/module.config.js

export default {
  id: "loan-management",
  type: "module",

  dependencies: [
    "core",
    "approval-workflow",
  ],

  entry: {
    navigation: "./loanManagementNavigation.js",
    routes: "./routes.js",
  },

  reducers: {
    loan: "./store/loanSlice.js",
  },
};