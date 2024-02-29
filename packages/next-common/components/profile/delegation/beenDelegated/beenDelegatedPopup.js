import React, { useMemo } from "react";
import AllBeenDelegatedPopupTrackList from "next-common/components/summary/democracyAllBeenDelegatedPopup/trackList";
import styled from "styled-components";
import BaseVotesPopup from "next-common/components/popup/baseVotesPopup";

const StyledPopup = styled(BaseVotesPopup)`
  width: 610px;
`;
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
      <AllBeenDelegatedPopupTrackList
        track={track}
        beenDelegatedList={beenDelegatedList}
        trackBeenDelegatedList={trackBeenDelegatedList}
      />
    </StyledPopup>
  );
}
