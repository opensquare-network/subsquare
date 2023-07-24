import { useState } from "react";
import { RightBarWrapper } from "next-common/components/layout/sidebar/rightBarWrapper";
import FellowshipTally from "./tally";
import Gov2Status from "../../../gov2/sidebar/status";
import { usePost } from "next-common/context/post";
import { gov2VotingState } from "next-common/utils/consts/state";
import { InlineWrapper } from "next-common/components/detail/sidebar/styled";
import Popup from "../votePopup";
import PrimaryButton from "next-common/components/buttons/primaryButton";
import LearnGov2Link from "next-common/components/links/learnGov2Link";
import { useChainSettings } from "next-common/context/chain";

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
        <LearnGov2Link anchor="polkadot-fellowship" />
      </InlineWrapper>
    </RightBarWrapper>
  );
}
