import { useMemo, useState } from "react";
import { RightBarWrapper } from "next-common/components/layout/sidebar/rightBarWrapper";
import FellowshipTally from "./tally";
import Gov2Status from "../../../gov2/sidebar/status";
import { usePost } from "next-common/context/post";
import { gov2VotingState } from "next-common/utils/consts/state";
import { InlineWrapper } from "next-common/components/detail/sidebar/styled";
import Popup from "../votePopup";
import PrimaryButton from "next-common/lib/button/primary";
import HowOpenGovWorks from "next-common/components/howOpenGovWorks";
import { VoteSuccessfulProvider } from "next-common/components/vote";
import VoteSuccessfulPopup from "../votePopup/voteSuccessful";
import { isNil, isUndefined, noop } from "lodash-es";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useSubCollectiveRank from "next-common/hooks/collectives/useSubCollectiveRank";
import { useRankedCollectivePallet } from "next-common/context/collectives/collectives";
import Tooltip from "next-common/components/tooltip";
import dynamic from "next/dynamic";
import AllSpendsRequest from "./request/allSpendsRequest";
import useRankedCollectiveMinRank from "next-common/hooks/collectives/useRankedCollectiveMinRank";
import FellowshipReferendumCleanupPoll from "next-common/components/fellowship/referenda/cleanupPoll";

const MyCollectiveVote = dynamic(
  () => import("next-common/components/collectives/referenda/myCollectiveVote"),
  {
    ssr: false,
  },
);

function CollectiveVote({ onClick = noop }) {
  const address = useRealAddress();
  const collectivePallet = useRankedCollectivePallet();
  const { rank, loading } = useSubCollectiveRank(address, collectivePallet);
  const minRank = useRankedCollectiveMinRank();
  const disabled = !address || loading || isNil(rank) || rank < minRank;
  const text = loading ? "Checking permissions" : "Vote";

  const tooltipText = useMemo(() => {
    if (loading) {
      return "Checking permissions";
    }

    if (!isUndefined(rank) && rank < minRank) {
      return `Only members with rank >= ${minRank} can vote`;
    }

    return null;
  }, [loading, rank, minRank]);

  return (
    <Tooltip content={tooltipText}>
      <PrimaryButton
        loading={address && loading}
        disabled={disabled}
        style={{ width: "100%" }}
        onClick={onClick}
      >
        {text}
      </PrimaryButton>
    </Tooltip>
  );
}

function LoginGuard({ children }) {
  const address = useRealAddress();
  const minRank = useRankedCollectiveMinRank();
  if (!address) {
    return (
      <Tooltip content={`Only members with rank >= ${minRank} can vote`}>
        <PrimaryButton style={{ width: "100%" }} disabled={true}>
          Vote
        </PrimaryButton>
      </Tooltip>
    );
  } else {
    return children;
  }
}

export default function FellowshipReferendumSideBar() {
  const post = usePost();
  const [showVote, setShowVote] = useState(false);
  const referendumIndex = post?.referendumIndex;
  const isVoting = gov2VotingState.includes(post?.state?.name);

  return (
    <RightBarWrapper>
      <AllSpendsRequest />
      <Gov2Status />
      <FellowshipTally />
      <MyCollectiveVote />
      {isVoting && (
        <LoginGuard>
          <CollectiveVote onClick={() => setShowVote(true)} />
        </LoginGuard>
      )}
      <VoteSuccessfulProvider VoteSuccessfulPopup={VoteSuccessfulPopup}>
        {showVote && (
          <Popup
            onClose={() => setShowVote(false)}
            referendumIndex={referendumIndex}
          />
        )}
      </VoteSuccessfulProvider>
      <FellowshipReferendumCleanupPoll />
      <InlineWrapper>
        <HowOpenGovWorks anchor="polkadot-fellowship" />
      </InlineWrapper>
    </RightBarWrapper>
  );
}
