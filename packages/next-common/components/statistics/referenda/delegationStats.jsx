import DelegateeSummary from "next-common/components/statistics/referenda/delegateeSummary";
import TrackDelegationSummary from "next-common/components/statistics/referenda/trackDelegationSummary";
import DelegatedAddressSummary from "next-common/components/statistics/referenda/delegatedAddressSummary";
import { cn } from "next-common/utils";
import { useNavCollapsed } from "next-common/context/nav";
import Summary from "./delegationSummary";

export default function ReferendaDelegationStats({
  tracksStats,
  delegatee,
  delegationSummary,
}) {
  const [navCollapsed] = useNavCollapsed();

  return (
    <>
      <div
        className={cn(
          "flex gap-4",
          "[&_>_div]:min-w-[calc(50%-16px)] [&_>_div]:flex-1",
          !navCollapsed ? "max-md:flex-col" : "max-sm:flex-col",
        )}
      >
        <TrackDelegationSummary tracks={tracksStats} />
        <DelegatedAddressSummary tracks={tracksStats} />
      </div>

      <Summary {...delegationSummary} />

      <div>
        <DelegateeSummary delegatee={delegatee} />
      </div>
    </>
  );
}
