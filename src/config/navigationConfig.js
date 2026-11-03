// export const NAVIGATION_CONFIG = [
//   {
//     id: "administration",
//     label: "Administration",
//     icon: "Settings",
//     type: "group",
//     module: "administration",
//     children: [
//       {
//         id: "users",
//         label: "User Management",
//         path: "/administration/users",
//         icon: "Users",
//         module: "administration",
//       },
//       {
//         id: "branches",
//         label: "Branch Management",
//         path: "/administration/branches",
//         icon: "Building2",
//         module: "administration",
//       },
//       {
//         id: "roles",
//         label: "Role Management",
//         path: "/administration/roles",
//         icon: "ShieldCheck",
//         module: "administration",
//       },
//       {
//         id: "permissions",
//         label: "Permission Management",
//         path: "/administration/permissions",
//         icon: "LockKeyhole",
//         module: "administration",
//       },
//     ],
//   },
//   {
//     id: "credit-management",
//     label: "Credit Management",
//     icon: "Users",
//     type: "group",
//     module: "credit-management",
//     // path: "/credit-management",
//     children: [
//       {
//         id: "credit-dashboard",
//         label: "Dashboard",
//         icon: "LayoutDashboard",
//         path: "/credit-management",
//       },
//       {
//         id: "occupations",
//         label: "Occupations",
//         icon: "Briefcase",
//         path: "/credit-management/occupations",
//       },
//       {
//         id: "document-types",
//         label: "Document Types",
//         icon: "FileText",
//         path: "/credit-management/document-types",
//       },
//       {
//         id: "credit-assessment",
//         label: "Credit Assessment",
//         icon: "ClipboardCheck",
//         path: "/credit-management/credit-assessment",
//       },
//       {
//         id: "applications",
//         label: "Applications",
//         icon: "FilePlus",
//         path: "/credit-management/applications",
//       },
//     ]
//   },
//   {
//     id: "loan-management",
//     label: "Loan Management",
//     icon: "Wallet",
//     type: "module",
//     module: "loan-management",
//     path: "/loan-management",
//   },
//   {
//     id: "collection",
//     label: "Collection",
//     icon: "HandCoins",
//     type: "module",
//     module: "collection",
//     path: "/collection",
//   },
//   {
//     id: "finance",
//     label: "Finance",
//     icon: "Calculator",
//     type: "module",
//     module: "finance",
//     path: "/finance",
//   },
// ];

export const NAVIGATION_CONFIG = [
  // ADMINISTRATION
  {
    id: "administration",
    label: "Administration",
    icon: "Settings",
    type: "group",
    module: "administration",
    children: [
      {
        id: "users",
        label: "User Management",
        path: "/administration/users",
        icon: "Users",
        module: "administration",
      },
      {
        id: "branches",
        label: "Branch Management",
        path: "/administration/branches",
        icon: "Building2",
        module: "administration",
      },
      {
        id: "roles",
        label: "Role Management",
        path: "/administration/roles",
        icon: "ShieldCheck",
        module: "administration",
      },
      {
        id: "permissions",
        label: "Permission Management",
        path: "/administration/permissions",
        icon: "LockKeyhole",
        module: "administration",
      },
    ],
  },

  // CREDIT MANAGEMENT
  {
    id: "credit-management",
    label: "Credit Management",
    icon: "Users",
    type: "group",
    module: "credit-management",
    children: [
      {
        id: "credit-dashboard",
        label: "Dashboard",
        path: "/credit-management",
        icon: "LayoutDashboard",
        module: "credit-management",
      },
      {
        id: "customers",
        label: "Customers",
        path: "/credit-management/customers",
        icon: "Users",
        module: "credit-management",
      },
      {
        id: "customer-types",
        label: "Customer Types",
        path: "/credit-management/customer-types",
        icon: "UserRound",
        module: "credit-management",
      },
      {
        id: "customer-categories",
        label: "Customer Categories",
        path: "/credit-management/customer-categories",
        icon: "Tags",
        module: "credit-management",
      },
      {
        id: "occupations",
        label: "Occupations",
        path: "/credit-management/occupations",
        icon: "BriefcaseBusiness",
        module: "credit-management",
      },
      {
        id: "document-types",
        label: "Document Types",
        path: "/credit-management/document-types",
        icon: "FileText",
        module: "credit-management",
      },
      {
        id: "credit-assessment",
        label: "Credit Assessment",
        path: "/credit-management/credit-assessment",
        icon: "ClipboardCheck",
        module: "credit-management",
      },
    ],
  },

  // LOAN MANAGEMENT
  {
    id: "loan-management",
    label: "Loan Management",
    icon: "Wallet",
    type: "group",
    module: "loan-management",
    children: [
      {
        id: "loan-dashboard",
        label: "Dashboard",
        path: "/loan-management",
        icon: "LayoutDashboard",
        module: "loan-management",
      },
      {
        id: "loan-applications",
        label: "Applications",
        path: "/loan-management/applications",
        icon: "FileText",
        module: "loan-management",
      },
      {
        id: "loan-products",
        label: "Loan Products",
        path: "/loan-management/products",
        icon: "Package",
        module: "loan-management",
      },
    ],
  },

  // COLLECTION
  {
    id: "collection",
    label: "Collection",
    icon: "HandCoins",
    type: "group",
    module: "collection",
    children: [
      {
        id: "collection-dashboard",
        label: "Dashboard",
        path: "/collection",
        icon: "LayoutDashboard",
        module: "collection",
      },
      {
        id: "collection-list",
        label: "Collection Management",
        path: "/collection/management",
        icon: "ClipboardList",
        module: "collection",
      },
    ],
  },

  // FINANCE
  {
    id: "finance",
    label: "Finance",
    icon: "Calculator",
    type: "group",
    module: "finance",
    children: [
      {
        id: "finance-dashboard",
        label: "Dashboard",
        path: "/finance",
        icon: "LayoutDashboard",
        module: "finance",
      },
      {
        id: "chart-of-accounts",
        label: "Chart of Accounts",
        path: "/finance/chart-of-accounts",
        icon: "BookOpen",
        module: "finance",
      },
      {
        id: "journal-entries",
        label: "Journal Entries",
        path: "/finance/journal-entries",
        icon: "NotebookPen",
        module: "finance",
      },
    ],
  },
];