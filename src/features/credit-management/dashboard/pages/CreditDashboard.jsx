import {
  ClipboardList,
  FileCheck2,
  FileClock,
  UsersRound,
} from "lucide-react";
import ModuleDashboard from "../../../dashboard/components/ModuleDashboard";

const summaryCards = [
  {
    title: "Total Applications",
    value: 1250,
    note: "Across all applications",
    icon: ClipboardList,
  },
  {
    title: "Pending Applications",
    value: 85,
    note: "Awaiting review",
    icon: FileClock,
  },
  {
    title: "Pending Assessments",
    value: 42,
    note: "Ready for assessment",
    icon: UsersRound,
  },
  {
    title: "Approved Applications",
    value: 980,
    note: "Successfully approved",
    icon: FileCheck2,
  },
];

export default function CreditDashboard() {
  return (
    <ModuleDashboard
      highlights={summaryCards.map((card) => ({
        ...card,
        value: card.value.toLocaleString(),
      }))}
      shortcuts={[
        {
          title: "Applications",
          description: "Review and manage credit applications.",
          href: "/credit-management/applications",
          icon: ClipboardList,
        },
        {
          title: "Assessments",
          description: "Continue with pending credit assessments.",
          href: "/credit-management/assessments",
          icon: FileCheck2,
        },
        {
          title: "Application reports",
          description: "View application reporting and summaries.",
          href: "/credit-management/reports/applications",
          icon: FileClock,
        },
      ]}
    />
  );
}