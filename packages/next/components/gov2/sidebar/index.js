import ExternalLinkIcon from "next-common/components/icons/externalLink";
import { emptyFunction } from "next-common/utils";
import { gov2VotingState } from "next-common/utils/consts/state";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useTheme } from "styled-components";
import Gov2Status from "./status";
import Gov2Tally from "./tally";
import { RightBarWrapper } from "next-common/components/layout/sidebar/rightBarWrapper";
import { usePost } from "next-common/context/post";
import { Link } from "next-common/components/detail/sidebar/styled";
import SecondaryButton from "next-common/components/buttons/secondaryButton";

const Popup = dynamic(() => import("../votePopup"), {
  ssr: false,
});

export default function Gov2Sidebar({ onVoteFinalized = emptyFunction }) {
  const detail = usePost();
  const { primaryPurple500 } = useTheme();
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

      {/* NOTE: link to polkadot gov2 blog */}
      <Link href="https://polkadot.network/blog/gov2-polkadots-next-generation-of-decentralised-governance/">
        How Governance V2 Works
        <ExternalLinkIcon color={primaryPurple500} />
      </Link>
    </RightBarWrapper>
  );
}
