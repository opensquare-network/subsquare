import { useState } from "react";
import Voters from "./voters";
import Action from "./action";
import { useChainSettings } from "next-common/context/chain";
import { RightBarWrapper } from "next-common/components/layout/sidebar/rightBarWrapper";
import { VoteSuccessfulProvider } from "next-common/components/vote";
import VoteSuccessfulPopup from "next-common/components/motion/voteSuccessful";
import dynamicPopup from "next-common/lib/dynamic/popup";

const VotePopup = dynamicPopup(() => import("./popup"));

export default function MotionSideBar({ motionHash, motionIndex }) {
  const [showPopup, setShowPopup] = useState(false);
  const { hideActionButtons } = useChainSettings();

  return (
    <>
      <RightBarWrapper>
        <Voters />
        {!hideActionButtons && <Action setShowPopup={setShowPopup} />}
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
