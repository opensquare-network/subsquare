import React from "react";
import { useMyTrackDelegations } from "../../../utils/hooks/referenda/useTrackDelegations";
import DelegationList from "../democracyBeenDelegated/beenDelegatedListPopup/delegationList";
import DelegationSummary from "../democracyBeenDelegated/beenDelegatedListPopup/delegationSummary";

export default function AllBeenDelegatedPopupTrackList({
  loading = false,
  trackBeenDelegatedList,
  track,
}) {
  const { delegations, isLoading } = useMyTrackDelegations(track);
  return (
    <>
      <DelegationSummary
        isLoading={isLoading}
        delegations={delegations}
        beenDelegatedList={trackBeenDelegatedList || []}
      />
      <DelegationList loading={loading} items={trackBeenDelegatedList} />
    </>
  );
}
