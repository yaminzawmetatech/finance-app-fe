import { CalendarClock, HandCoins, MapPinned } from "lucide-react";
import ModuleDashboard from "../../dashboard/components/ModuleDashboard";

export default function CollectionDashboard() {
  return (
    <ModuleDashboard
      shortcuts={[
        {
          title: "Collection activity",
          description: "Keep track of day-to-day repayment follow-ups.",
          icon: HandCoins,
        },
        {
          title: "Due schedule",
          description: "Keep upcoming collection dates in view.",
          icon: CalendarClock,
        },
        {
          title: "Field operations",
          description: "Organize collection work across your service areas.",
          icon: MapPinned,
        },
      ]}
    />
  );
}