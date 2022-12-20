import { useState } from "react";
import { useTheme } from "styled-components";
import { RightBarWrapper } from "next-common/components/layout/sidebar/rightBarWrapper";
import FellowshipTally from "./tally";
import Gov2Status from "../../../gov2/sidebar/status";
import { usePost } from "next-common/context/post";
import { gov2State } from "next-common/utils/consts/state";
import { VoteButton, Link } from "components/gov2/sidebar/styled";
import ExternalLinkIcon from "next-common/components/icons/externalLink";
import Popup from "../votePopup";

export default function FellowshipReferendumSideBar() {
  const post = usePost();
  const { primaryPurple500 } = useTheme();
  const [showVote, setShowVote] = useState(false);
  const referendumIndex = post?.referendumIndex;
  const isVoting = [
    gov2State.Submitted,
    gov2State.Queueing,
    gov2State.Deciding,
    gov2State.Confirming,
  ].includes(post?.state?.name);

  return (
    <RightBarWrapper>
      <Gov2Status />
      <FellowshipTally />
      {true && (
        <VoteButton
          onClick={() => {
            setShowVote(true);
          }}
        >
          Vote
        </VoteButton>
      )}
      {showVote && (
        <Popup
          onClose={() => setShowVote(false)}
          referendumIndex={referendumIndex}
          // onFinalized={onVoteFinalized}
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
