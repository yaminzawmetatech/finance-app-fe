import ApprovalWorkflowList from "./pages/ApprovalWorkflowList";


export const approvalRoutes = [
  {
    path: "/approvals/inbox",
    element: <ApprovalWorkflowList />,
    permission: "AddressState",
  },
];