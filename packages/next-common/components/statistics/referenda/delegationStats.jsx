import DelegateeSummary from "next-common/components/statistics/referenda/delegateeSummary";
import TrackDelegationSummary from "next-common/components/statistics/referenda/trackDelegationSummary";
import DelegatedAddressSummary from "next-common/components/statistics/referenda/delegatedAddressSummary";
import { cn } from "next-common/utils";
import { useNavCollapsed } from "next-common/context/nav";
import Summary from "./delegationSummary";
import TrackSelect from "./trackSelect";
import { useState } from "react";
import TrackDelegationList from "./trackDelegationList";

export default function ReferendaDelegationStats({
  tracksStats,
  delegatee,
  delegationSummary,
}) {
  const [navCollapsed] = useNavCollapsed();
  const [selectedTrackId, setSelectedTrackId] = useState("");

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

      <div className="flex justify-between mx-6 max-sm:flex-col max-sm:gap-[14px]">
        <div className="flex items-center text16Bold text-textPrimary">
          Delegation
        </div>
        <div className="flex gap-[8px] items-center">
          <span className="text12Medium text-textPrimary">Event</span>
          <TrackSelect
            selectedTrackId={selectedTrackId}
            setSelectedTrackId={setSelectedTrackId}
          />
        </div>
      </div>

      {selectedTrackId ? (
        <TrackDelegationList trackId={selectedTrackId} />
      ) : (
        <>
          <Summary {...delegationSummary} />
          <div>
            <DelegateeSummary delegatee={delegatee} />
          </div>
        </>
      )}
    </>
  );
}
