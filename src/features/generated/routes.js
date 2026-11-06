// generated/routes.js

import { approvalRoutes } from "../capabilities/approval-workflow/routes";
import CreditManagementRoutes from "../credit-management/routes/creditManagementRoutes";

export const APP_ROUTES = [
  ...approvalRoutes,
  ...CreditManagementRoutes,
];