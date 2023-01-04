import { useState } from "react";
import { RightBarWrapper } from "next-common/components/layout/sidebar/rightBarWrapper";
import FellowshipTally from "./tally";
import Gov2Status from "../../../gov2/sidebar/status";
import { usePost } from "next-common/context/post";
import { gov2VotingState } from "next-common/utils/consts/state";
import { InlineWrapper } from "next-common/components/detail/sidebar/styled";
import Popup from "../votePopup";
import { emptyFunction } from "next-common/utils";
import SecondaryButton from "next-common/components/buttons/secondaryButton";
import LearnGov2Link from "next-common/components/links/learnGov2Link";

export default function FellowshipReferendumSideBar({
  onVoteFinalized = emptyFunction,
}) {
  const post = usePost();
  const [showVote, setShowVote] = useState(false);
  const referendumIndex = post?.referendumIndex;
  const isVoting = gov2VotingState.includes(post?.state?.name);

  return (
    <RightBarWrapper>
      <Gov2Status />
      <FellowshipTally />
      {isVoting && (
        <InlineWrapper>
          <SecondaryButton
            style={{ width: "100%" }}
            onClick={() => {
              setShowVote(true);
            }}
          >
            Vote
          </SecondaryButton>
        </InlineWrapper>
      )}
      {showVote && (
        <Popup
          onClose={() => setShowVote(false)}
          referendumIndex={referendumIndex}
          onFinalized={onVoteFinalized}
        />
      )}

      <InlineWrapper>
        <LearnGov2Link anchor="polkadot-fellowship" />
      </InlineWrapper>
    </RightBarWrapper>
  );
}
