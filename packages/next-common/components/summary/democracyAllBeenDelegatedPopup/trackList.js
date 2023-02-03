import { useTrackDelegations } from "../../../utils/hooks/referenda/useDelegation";
import DelegationList from "../democracyBeenDelegated/beenDelegatedListPopup/delegationList";
import DelegationSummary from "../democracyBeenDelegated/beenDelegatedListPopup/delegationSummary";

export default function AllBeenDelegatedPopupTrackList({
  loading = false,
  trackBeenDelegatedList,
  track,
}) {
  const delegations = useTrackDelegations(track);
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
