import { ClipboardCheck, Landmark, WalletCards } from "lucide-react";
import ModuleDashboard from "../../dashboard/components/ModuleDashboard";

export default function LoanDashboard() {
  return (
    <ModuleDashboard
      eyebrow="LOAN MANAGEMENT"
      title="Loan operations"
      description="A focused workspace for loan products, approvals, and repayments."
      accent="blue"
      shortcuts={[
        {
          title: "Loan applications",
          description: "Review and organize applications in progress.",
          icon: ClipboardCheck,
        },
        {
          title: "Loan products",
          description: "Keep your lending products clearly defined.",
          icon: Landmark,
        },
        {
          title: "Repayments",
          description: "Stay close to repayment schedules and activity.",
          icon: WalletCards,
        },
      ]}
    />
  );
}