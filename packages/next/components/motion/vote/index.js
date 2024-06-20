import { useEffect, useRef, useState } from "react";
import { emptyFunction } from "next-common/utils";
import { useDetailType } from "next-common/context/page";
import Voters from "./voters";
import Action from "./action";
import { useChainSettings } from "next-common/context/chain";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import isMoonChain from "next-common/utils/isMoonChain";
import { RightBarWrapper } from "next-common/components/layout/sidebar/rightBarWrapper";
import useIsUseMetamask from "next-common/hooks/useIsUseMetamask";
import { VoteSuccessfulProvider } from "next-common/components/vote";
import VoteSuccessfulPopup from "next-common/components/motion/voteSuccessful";
import dynamicPopup from "next-common/lib/dynamic/popup";

const VotePopup = dynamicPopup(() => import("./popup"));

const MoonVotePopup = dynamicPopup(() => import("./popup/moonPopup"));

export default function Vote({
  votes = [],
  prime,
  motionHash,
  motionIndex,
  isLoadingVote = false,
  onInBlock = emptyFunction,
}) {
  const type = useDetailType();
  const [showPopup, setShowPopup] = useState(false);
  const { hideActionButtons } = useChainSettings();
  const isUseMetamask = useIsUseMetamask();
  const refVotes = useRef();

  useEffect(() => {
    refVotes.current = votes;
  }, [votes]);

  let Popup = VotePopup;
  if (isMoonChain() && isUseMetamask) {
    Popup = MoonVotePopup;
  }

  // No openTechComm precompile at the moment
  const noAction = type === detailPageCategory.OPEN_TECH_COMM_PROPOSAL;

  return (
    <>
      <RightBarWrapper>
        <Voters votes={votes} isLoadingVote={isLoadingVote} prime={prime} />
        {!hideActionButtons && !noAction && (
          <Action setShowPopup={setShowPopup} />
        )}
      </RightBarWrapper>
      <VoteSuccessfulProvider VoteSuccessfulPopup={VoteSuccessfulPopup}>
        {showPopup && (
          <Popup
            votes={votes}
            refVotes={refVotes}
            motionHash={motionHash}
            motionIndex={motionIndex}
            type={type}
            onClose={() => setShowPopup(false)}
            onInBlock={onInBlock}
          />
        )}
      </VoteSuccessfulProvider>
    </>
  );
}
