import { useState } from "react";
import { RightBarWrapper } from "next-common/components/layout/sidebar/rightBarWrapper";
import FellowshipTally from "./tally";
import Gov2Status from "../../../gov2/sidebar/status";
import { usePost } from "next-common/context/post";
import { gov2VotingState } from "next-common/utils/consts/state";
import { InlineWrapper } from "next-common/components/detail/sidebar/styled";
import Popup from "../votePopup";
import PrimaryButton from "next-common/components/buttons/primaryButton";
import { useChainSettings } from "next-common/context/chain";
import HowOpenGovWorks from "next-common/components/howOpenGovWorks";

export default function FellowshipReferendumSideBar() {
  const post = usePost();
  const [showVote, setShowVote] = useState(false);
  const { hideActionButtons } = useChainSettings();
  const referendumIndex = post?.referendumIndex;
  const isVoting = gov2VotingState.includes(post?.state?.name);

  return (
    <RightBarWrapper>
      <Gov2Status />
      <FellowshipTally />
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
        />
      )}

      <InlineWrapper>
        <HowOpenGovWorks anchor="polkadot-fellowship" />
      </InlineWrapper>
    </RightBarWrapper>
  );
}
