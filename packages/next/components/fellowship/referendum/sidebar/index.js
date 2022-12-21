import { useState } from "react";
import { useTheme } from "styled-components";
import { RightBarWrapper } from "next-common/components/layout/sidebar/rightBarWrapper";
import FellowshipTally from "./tally";
import Gov2Status from "../../../gov2/sidebar/status";
import { usePost } from "next-common/context/post";
import { gov2VotingState } from "next-common/utils/consts/state";
import { Link } from "next-common/components/detail/sidebar/styled";
import ExternalLinkIcon from "next-common/components/icons/externalLink";
import Popup from "../votePopup";
import { emptyFunction } from "next-common/utils";
import SecondaryButton from "next-common/components/buttons/secondaryButton";

export default function FellowshipReferendumSideBar({
  onVoteFinalized = emptyFunction,
}) {
  const post = usePost();
  const { primaryPurple500 } = useTheme();
  const [showVote, setShowVote] = useState(false);
  const referendumIndex = post?.referendumIndex;
  const isVoting = gov2VotingState.includes(post?.state?.name);

  return (
    <RightBarWrapper>
      <Gov2Status />
      <FellowshipTally />
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
          onFinalized={onVoteFinalized}
        />
      )}

      {/* NOTE: link to polkadot gov2 blog */}
      <Link href="https://polkadot.network/blog/gov2-polkadots-next-generation-of-decentralised-governance/">
        How Governance V2 Works
        <ExternalLinkIcon color={primaryPurple500} />
      </Link>
    </RightBarWrapper>
  );
}
