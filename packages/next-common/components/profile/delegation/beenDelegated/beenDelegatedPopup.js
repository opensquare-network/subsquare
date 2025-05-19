import React, { useMemo } from "react";
import styled from "styled-components";
import BaseVotesPopup from "next-common/components/popup/baseVotesPopup";
import { useTrackDelegations } from "next-common/utils/hooks/referenda/useTrackDelegations";
import DelegationList from "next-common/components/summary/democracyBeenDelegated/beenDelegatedListPopup/delegationList";
import DelegationSummary from "next-common/components/summary/democracyBeenDelegated/beenDelegatedListPopup/delegationSummary";
import useProfileAddress from "../../useProfileAddress";
import { usePathname } from "next/navigation";
import useRealAddress from "next-common/utils/hooks/useRealAddress";

const StyledPopup = styled(BaseVotesPopup)`
  width: 640px;
`;

function TrackBeenDelegatedPopupList({
  loading = false,
  trackBeenDelegatedList,
  track,
}) {
  const pathname = usePathname();
  const isMyDelegationPage = pathname.startsWith("/delegation/mine");
  const profileAddress = useProfileAddress();
  const myAddress = useRealAddress();
  const realAddress = isMyDelegationPage ? myAddress : profileAddress;
  const delegations = useTrackDelegations(track, realAddress);

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

export default function BeenDelegatedPopup({
  track,
  beenDelegatedList,
  setShow,
}) {
  const trackBeenDelegatedList = useMemo(() => {
    const beenDelegated = beenDelegatedList?.find((item) => {
      return item.track?.id === track;
    });
    return beenDelegated?.beenDelegated;
  }, [track, beenDelegatedList]);

  return (
    <StyledPopup title="Been Delegated" onClose={() => setShow(false)}>
      <TrackBeenDelegatedPopupList
        track={track}
        beenDelegatedList={beenDelegatedList}
        trackBeenDelegatedList={trackBeenDelegatedList}
      />
    </StyledPopup>
  );
}
