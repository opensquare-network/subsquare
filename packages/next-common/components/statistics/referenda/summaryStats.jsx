import { useNavCollapsed } from "next-common/context/nav";
import { cn } from "next-common/utils";
import ReferendaSummary from "./summary";
import OpenGovTurnoutSummary from "./turnoutSummary";

export default function ReferendaSummaryStats({ summary }) {
  const [navCollapsed] = useNavCollapsed();

  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-4",
        !navCollapsed ? "max-md:grid-cols-1" : "max-sm:grid-cols-1",
      )}
    >
      <ReferendaSummary summary={summary} />
      <OpenGovTurnoutSummary summary={summary} />
    </div>
  );
}
