import { useMemo, useState } from "react";
import { RightBarWrapper } from "next-common/components/layout/sidebar/rightBarWrapper";
import FellowshipTally from "./tally";
import Gov2Status from "../../../gov2/sidebar/status";
import { usePost } from "next-common/context/post";
import { gov2VotingState } from "next-common/utils/consts/state";
import { InlineWrapper } from "next-common/components/detail/sidebar/styled";
import Popup from "../votePopup";
import PrimaryButton from "next-common/lib/button/primary";
import { useChainSettings } from "next-common/context/chain";
import HowOpenGovWorks from "next-common/components/howOpenGovWorks";
import { VoteSuccessfulProvider } from "next-common/components/vote";
import VoteSuccessfulPopup from "../votePopup/voteSuccessful";
import { isNil, isUndefined, noop } from "lodash-es";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useSubCollectiveRank from "next-common/hooks/collectives/useSubCollectiveRank";
import { useRankedCollectivePallet } from "next-common/context/collectives/collectives";
import {
  getAmbassadorMinRankOfClass,
  getFellowshipMinRankOfClass,
} from "next-common/context/post/fellowship/useMaxVoters";
import { useTrack } from "next-common/context/post/gov2/track";
import Tooltip from "next-common/components/tooltip";

function useMinRank() {
  const { id: trackId } = useTrack();

  const collectivePallet = useRankedCollectivePallet();
  if ("fellowshipCollective" === collectivePallet) {
    return getFellowshipMinRankOfClass(trackId);
  } else if ("ambassadorCollective" === collectivePallet) {
    return getAmbassadorMinRankOfClass(trackId);
  } else {
    throw new Error(`Can not get min rank of class for pallet ${collectivePallet}`);
  }
}

function CollectiveVote({ onClick = noop }) {
  const address = useRealAddress();
  const collectivePallet = useRankedCollectivePallet();
  const { rank, loading } = useSubCollectiveRank(address, collectivePallet);
  const minRank = useMinRank();
  const disabled = loading || isNil(rank) || rank < minRank;
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
        loading={loading}
        disabled={disabled}
        style={{ width: "100%" }}
        onClick={onClick}
      >
        {text}
      </PrimaryButton>
    </Tooltip>
  );
}

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
        <CollectiveVote onClick={() => setShowVote(true)} />
      )}
      <VoteSuccessfulProvider VoteSuccessfulPopup={VoteSuccessfulPopup}>
        {showVote && (
          <Popup
            onClose={() => setShowVote(false)}
            referendumIndex={referendumIndex}
          />
        )}
      </VoteSuccessfulProvider>

      <InlineWrapper>
        <HowOpenGovWorks anchor="polkadot-fellowship" />
      </InlineWrapper>
    </RightBarWrapper>
  );
}
