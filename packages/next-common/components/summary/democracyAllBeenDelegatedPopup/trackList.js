import React from "react";
import { useMyTrackDelegations } from "../../../utils/hooks/referenda/useTrackDelegations";
import DelegationList from "../democracyBeenDelegated/beenDelegatedListPopup/delegationList";
import DelegationSummary from "../democracyBeenDelegated/beenDelegatedListPopup/delegationSummary";

export default function AllBeenDelegatedPopupTrackList({
  loading = false,
  trackBeenDelegatedList,
  track,
}) {
  const delegations = useMyTrackDelegations(track);
  return (
    <>
      <DelegationSummary
        delegations={delegations}
        beenDelegatedList={trackBeenDelegatedList || []}
      />
      <DelegationList loading={loading} items={trackBeenDelegatedList} />
    </>
  );
}
