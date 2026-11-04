import { ArrowLeftRight, ChartNoAxesCombined, Wallet } from "lucide-react";
import ModuleDashboard from "../../dashboard/components/ModuleDashboard";

export default function FinanceDashboard() {
  return (
    <ModuleDashboard
      shortcuts={[
        {
          title: "Financial overview",
          description: "Review the key areas of your finance workspace.",
          icon: ChartNoAxesCombined,
        },
        {
          title: "Accounts & balances",
          description: "Keep your account activity organized.",
          icon: Wallet,
        },
        {
          title: "Transactions",
          description: "Follow the flow of day-to-day transactions.",
          icon: ArrowLeftRight,
        },
      ]}
    />
  );
}