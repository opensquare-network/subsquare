import { SystemLoadingDots } from "@osn/icons/subsquare";
import SummaryItem from "next-common/components/summary/layout/item";
import SummaryLayout from "next-common/components/summary/layout/layout";
import Tooltip from "next-common/components/tooltip";

const ITEMS = [
  {
    key: "regions",
    title: "My Regions",
    tooltip:
      "Regions you own that are active or upcoming (expired ones are not counted)",
  },
  {
    key: "cores",
    title: "My Cores",
    tooltip:
      "Cores bought or renewed for the current or the next period, plus the cores of your regions and of your coretime pool contributions",
  },
  {
    key: "pendingRenewals",
    title: "Pending Renewals",
    tooltip:
      "Your cores with a renewal right available and auto-renewal not enabled",
  },
  {
    key: "autoRenew",
    title: "Auto-renew",
    tooltip: "Your cores with auto-renewal enabled",
  },
];

export default function MyCoretimeSummaryItems({ summary, loading }) {
  return (
    <SummaryLayout>
      {ITEMS.map(({ key, title, tooltip }) => (
        <SummaryItem
          key={key}
          title={
            <Tooltip content={tooltip}>
              <span>{title}</span>
            </Tooltip>
          }
        >
          {loading ? (
            <SystemLoadingDots width={20} height={20} />
          ) : (
            summary[key]
          )}
        </SummaryItem>
      ))}
    </SummaryLayout>
  );
}
