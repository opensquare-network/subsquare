import { useState } from "react";
import dynamic from "next/dynamic";
import { emptyFunction } from "next-common/utils";
import { useDetailType } from "next-common/context/page";
import Voters from "./voters";
import Action from "./action";
import { useChainSettings } from "next-common/context/chain";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import isMoonChain from "next-common/utils/isMoonChain";
import { RightBarWrapper } from "next-common/components/layout/sidebar/rightBarWrapper";
import useIsUseMetamask from "next-common/hooks/useIsUseMetamask";

const VotePopup = dynamic(() => import("./popup"), {
  ssr: false,
});

const MoonVotePopup = dynamic(() => import("./popup/moonPopup"), {
  ssr: false,
});

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
      {showPopup && (
        <Popup
          votes={votes}
          motionHash={motionHash}
          motionIndex={motionIndex}
          type={type}
          onClose={() => setShowPopup(false)}
          onInBlock={onInBlock}
        />
      )}
    </>
  );
}
