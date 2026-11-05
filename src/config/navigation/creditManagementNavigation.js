
export const CREDIT_MANAGEMENT_NAVIGATION = [
  {
    id: "credit-management",
    label: "Credit Management",
    icon: "Users",
    type: "group",
    children: [
      {
        id: "credit-dashboard",
        label: "Dashboard",
        path: "/credit-management",
        icon: "LayoutDashboard",
        permission: "credit-management.dashboard.view",
      },
      {
        id: "customers",
        label: "Customers",
        path: "/credit-management/customers",
        icon: "Users",
        permission: "credit-management.customers.view",
      },
      {
        id: "customer-types",
        label: "Customer Types",
        path: "/credit-management/customer-types",
        icon: "UserRound",
        permission: "credit-management.customer-types.view",
      },
      {
        id: "customer-categories",
        label: "Customer Categories",
        path: "/credit-management/customer-categories",
        icon: "Tags",
        permission: "credit-management.customer-categories.view",
      },
      {
        id: "occupations",
        label: "Occupations",
        path: "/credit-management/occupations",
        icon: "BriefcaseBusiness",
        permission: "credit-management.occupations.view",
      },
      {
        id: "document-types",
        label: "Document Types",
        path: "/credit-management/document-types",
        icon: "FileText",
        permission: "credit-management.document-types.view",
      },
      {
        id: "credit-assessment",
        label: "Credit Assessment",
        path: "/credit-management/credit-assessment",
        icon: "ClipboardCheck",
        permission: "credit-management.assessments.view",
      },
    ],
  },
];
