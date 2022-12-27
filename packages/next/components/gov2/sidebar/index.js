import { emptyFunction } from "next-common/utils";
import { gov2VotingState } from "next-common/utils/consts/state";
import dynamic from "next/dynamic";
import { useState } from "react";
import Gov2Status from "./status";
import Gov2Tally from "./tally";
import { RightBarWrapper } from "next-common/components/layout/sidebar/rightBarWrapper";
import { usePost } from "next-common/context/post";
import SecondaryButton from "next-common/components/buttons/secondaryButton";
import LearnGov2Link from "next-common/components/links/learnGov2Link";

const Popup = dynamic(() => import("../votePopup"), {
  ssr: false,
});

export default function Gov2Sidebar({ onVoteFinalized = emptyFunction }) {
  const detail = usePost();
  const [showVote, setShowVote] = useState(false);
  const referendumIndex = detail?.referendumIndex;
  const trackId = detail?.track;
  const isVoting = gov2VotingState.includes(detail?.state?.name);

  return (
    <RightBarWrapper>
      <Gov2Status />

      <Gov2Tally />

      {isVoting && (
        <SecondaryButton
          onClick={() => {
            setShowVote(true);
          }}
        >
          Vote
        </SecondaryButton>
      )}
      {showVote && (
        <Popup
          onClose={() => setShowVote(false)}
          referendumIndex={referendumIndex}
          trackId={trackId}
          onFinalized={onVoteFinalized}
        />
      )}

      <LearnGov2Link />
    </RightBarWrapper>
  );
}
