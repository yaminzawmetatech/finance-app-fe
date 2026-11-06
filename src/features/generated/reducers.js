import users from "../../features/core/users/store/usersSlice";
import auth from "../../features/auth/slices/authSlice";

import approvalWorkflows from "../../features/capabilities/approval-workflow/store/approvalWorkflowSlice";

export const APP_REDUCERS = {
  users,
  auth,
  approvalWorkflows
};