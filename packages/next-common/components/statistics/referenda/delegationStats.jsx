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
          "grid grid-cols-2 gap-4",
          !navCollapsed ? "max-md:grid-cols-1" : "max-sm:grid-cols-1",
        )}
      >
        <TrackDelegationSummary tracks={tracksStats} />
        <DelegatedAddressSummary tracks={tracksStats} />
      </div>

      <div className="flex justify-between mx-6 max-sm:flex-col max-sm:gap-[14px]">
        <div className="flex items-center text16Bold text-textPrimary">
          Delegation
        </div>
        <div className="flex items-center">
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
