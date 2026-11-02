import { MODULES } from "./modules";

export const NAVIGATION = [
  {
    label: "Administration",
    module: MODULES.ADMINISTRATION,
    path: "/administration",
    icon: "settings",
  },
  {
    label: "Credit Management",
    module: MODULES.CREDIT_MANAGEMENT,
    path: "/credit-management",
    icon: "people",
  },
  {
    label: "Loan Management",
    module: MODULES.LOAN_MANAGEMENT,
    path: "/loan-management",
    icon: "account-balance",
  },
  {
    label: "Collection",
    module: MODULES.COLLECTION,
    path: "/collection",
    icon: "payments",
  },
  {
    label: "Finance",
    module: MODULES.FINANCE,
    path: "/finance",
    icon: "finance",
  },
];