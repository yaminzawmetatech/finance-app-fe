
import { CREDIT_MANAGEMENT_NAVIGATION } from "../../features/credit-management/creditManagementNavigation";
import { CORE_NAVIGATION } from "../../features/core/coreNavigation";
// import { LOAN_MANAGEMENT_NAVIGATION } from "./loanManagementNavigation";
// import { COLLECTION_NAVIGATION } from "./collectionNavigation";
// import { FINANCE_NAVIGATION } from "./financeNavigation";

export const NAVIGATION_CONFIG = [
  ...CORE_NAVIGATION,
  ...CREDIT_MANAGEMENT_NAVIGATION,

  // ...LOAN_MANAGEMENT_NAVIGATION,
  // ...COLLECTION_NAVIGATION,
  // ...FINANCE_NAVIGATION,
];
