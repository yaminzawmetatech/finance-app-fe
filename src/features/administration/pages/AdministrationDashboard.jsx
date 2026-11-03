import { Building2, ShieldCheck, Users } from "lucide-react";
import ModuleDashboard from "../../dashboard/components/ModuleDashboard";

export default function AdministrationDashboard() {
  return (
    <ModuleDashboard
      eyebrow="ADMINISTRATION"
      title="Welcome to your workspace"
      description="Keep your team, access, and company operations organized from one place."
      accent="orange"
      shortcuts={[
        {
          title: "User management",
          description: "Manage the people who use your workspace.",
          href: "/administration/users",
          icon: Users,
        },
        {
          title: "Branch operations",
          description: "Keep your organization connected across branches.",
          icon: Building2,
        },
        {
          title: "Roles & access",
          description: "Maintain the right access for every role.",
          icon: ShieldCheck,
        },
      ]}
    />
  );
}