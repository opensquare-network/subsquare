import { gov2VotingState } from "next-common/utils/consts/state";
import dynamic from "next/dynamic";
import { useState } from "react";
import Gov2Status from "./status";
import Gov2Tally from "./tally";
import { RightBarWrapper } from "next-common/components/layout/sidebar/rightBarWrapper";
import { usePost } from "next-common/context/post";
import PrimaryButton from "next-common/components/buttons/primaryButton";
import { InlineWrapper } from "next-common/components/detail/sidebar/styled";
import { useChainSettings } from "next-common/context/chain";
import isMoonChain from "next-common/utils/isMoonChain";
import MyVote from "./tally/myVote";
import HowOpenGovWorks from "next-common/components/howOpenGovWorks";

const VotePopup = dynamic(() => import("../votePopup"), {
  ssr: false,
});

const MoonVotePopup = dynamic(() => import("../votePopup/moonPopup"), {
  ssr: false,
});

export default function Gov2Sidebar() {
  const detail = usePost();
  const [showVote, setShowVote] = useState(false);
  const referendumIndex = detail?.referendumIndex;
  const trackId = detail?.track;
  const isVoting = gov2VotingState.includes(detail?.state?.name);
  const { hideActionButtons } = useChainSettings();

  let Popup = VotePopup;
  if (isMoonChain()) {
    Popup = MoonVotePopup;
  }

  return (
    <RightBarWrapper>
      <Gov2Status />

      <Gov2Tally />

      <MyVote />

      {isVoting && !hideActionButtons && (
        <InlineWrapper>
          <PrimaryButton
            style={{ width: "100%" }}
            onClick={() => {
              setShowVote(true);
            }}
          >
            Vote
          </PrimaryButton>
        </InlineWrapper>
      )}
      {showVote && (
        <Popup
          onClose={() => setShowVote(false)}
          referendumIndex={referendumIndex}
          trackId={trackId}
        />
      )}

      <InlineWrapper>
        <HowOpenGovWorks anchor="referenda" />
      </InlineWrapper>
    </RightBarWrapper>
  );
}
