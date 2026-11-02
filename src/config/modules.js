export const MODULES = {
  ADMINISTRATION: "administration",
  CREDIT_MANAGEMENT: "credit-management",
  LOAN_MANAGEMENT: "loan-management",
  COLLECTION: "collection",
  FINANCE: "finance",
};

export const MODULE_DEFINITIONS = [
  {
    key: MODULES.ADMINISTRATION,
    name: "Administration",
    description: "Manage users, roles, branches, and settings.",
    route: "/administration",
    required: true,
  },
  {
    key: MODULES.CREDIT_MANAGEMENT,
    name: "Credit Management",
    description: "Manage clients, groups, and credit assessments.",
    route: "/credit-management",
    required: false,
  },
  {
    key: MODULES.LOAN_MANAGEMENT,
    name: "Loan Management",
    description: "Manage loan products, applications, and disbursements.",
    route: "/loan-management",
    required: false,
  },
  {
    key: MODULES.COLLECTION,
    name: "Collection",
    description: "Manage repayments, collections, and arrears.",
    route: "/collection",
    required: false,
  },
  {
    key: MODULES.FINANCE,
    name: "Finance",
    description: "Manage accounting, general ledger, and financial reports.",
    route: "/finance",
    required: false,
  },
];