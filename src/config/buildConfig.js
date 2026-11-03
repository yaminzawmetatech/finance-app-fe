import { COMPANY_BUILDS } from "./companyBuilds";

const buildName = import.meta.env.VITE_COMPANY_BUILD;

export const BUILD_CONFIG =
  COMPANY_BUILDS[buildName] || {
    name: "Development",
    modules: [
      "administration",
      "credit-management",
      "loan-management",
      "collection",
      "finance",
    ],
  };

export const ENABLED_MODULES = BUILD_CONFIG.modules;