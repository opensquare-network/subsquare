import { useState } from "react";
import { useDetailType } from "next-common/context/page";
import Voters from "./voters";
import Action from "./action";
import { useChainSettings } from "next-common/context/chain";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import { RightBarWrapper } from "next-common/components/layout/sidebar/rightBarWrapper";
import { VoteSuccessfulProvider } from "next-common/components/vote";
import VoteSuccessfulPopup from "next-common/components/motion/voteSuccessful";
import dynamicPopup from "next-common/lib/dynamic/popup";

const VotePopup = dynamicPopup(() => import("./popup"));

export default function MotionSideBar({ motionHash, motionIndex }) {
  const type = useDetailType();
  const [showPopup, setShowPopup] = useState(false);
  const { hideActionButtons } = useChainSettings();

  // No openTechComm precompile at the moment, for moonriver
  const noAction = type === detailPageCategory.OPEN_TECH_COMM_PROPOSAL;

  return (
    <>
      <RightBarWrapper>
        <Voters />
        {!hideActionButtons && !noAction && (
          <Action setShowPopup={setShowPopup} />
        )}
      </RightBarWrapper>
      <VoteSuccessfulProvider VoteSuccessfulPopup={VoteSuccessfulPopup}>
        {showPopup && (
          <VotePopup
            motionHash={motionHash}
            motionIndex={motionIndex}
            onClose={() => setShowPopup(false)}
          />
        )}
      </VoteSuccessfulProvider>
    </>
  );
}
