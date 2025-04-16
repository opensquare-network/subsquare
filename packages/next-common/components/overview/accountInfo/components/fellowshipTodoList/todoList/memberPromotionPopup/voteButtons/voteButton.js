import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { cn } from "next-common/utils";
import useTxSubmission from "next-common/components/common/tx/useTxSubmission";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import SecondaryButton from "next-common/lib/button/secondary";
import { useContextApi } from "next-common/context/api";
import { useRankedCollectivePallet } from "next-common/context/collectives/collectives";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";
import { useFellowshipMemberRank } from "next-common/hooks/fellowship/useFellowshipMemberRank";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useValueFromBatchResult } from "next-common/context/batch";
import Tooltip from "next-common/components/tooltip";

const mapTrackToRank = {
  11: 1, // Retain At 1 Dan
  12: 2,
  13: 3,
  14: 4,
  15: 5,
  16: 6,

  21: 1, // Promote To 1 Dan
  22: 2,
  23: 3,
  24: 4,
  25: 5,
  26: 6,

  31: 1, // Fast Promote To 1 Dan
  32: 2,
  33: 3,
};

function getRequireRankFromTrack(trackId) {
  if (trackId in mapTrackToRank) {
    return mapTrackToRank[trackId];
  }

  throw new Error(`Cannot get rank from trackId: ${trackId}`);
}

function VoteButtonImpl({ referendumIndex, voteAye, children }) {
  const dispatch = useDispatch();
  const api = useContextApi();
  const collectivePallet = useRankedCollectivePallet();
  const realAddress = useRealAddress();
  const rank = useFellowshipMemberRank(realAddress, collectivePallet);
  const { value: referendumPost, loading: isReferendaPostLoading } =
    useValueFromBatchResult(referendumIndex);

  const voteTxFunc = useCallback(() => {
    return api.tx[collectivePallet].vote(referendumIndex, voteAye);
  }, [api, collectivePallet, referendumIndex, voteAye]);

  const { doSubmit: doSubmitVote } = useTxSubmission({
    getTxFunc: voteTxFunc,
    onInBlock: () => {
      dispatch(newSuccessToast("Vote successfully"));
    },
  });

  let disabled = false;
  let tooltipContent = "";
  if (!isReferendaPostLoading && referendumPost) {
    const requiredRank = getRequireRankFromTrack(referendumPost.track);
    disabled = requiredRank > rank;
    if (disabled) {
      tooltipContent = `Only rank >= ${requiredRank} can vote on this proposal`;
    }
  }

  return (
    <Tooltip content={tooltipContent}>
      <SecondaryButton
        disabled={disabled}
        className={cn(
          "p-[6px]",
          disabled && "[&_svg_path]:stroke-textDisabled",
        )}
        size="small"
        onClick={doSubmitVote}
      >
        {children}
      </SecondaryButton>
    </Tooltip>
  );
}

export default function VoteButton({ children, ...props }) {
  return (
    <SignerPopupWrapper>
      <VoteButtonImpl {...props}>{children}</VoteButtonImpl>
    </SignerPopupWrapper>
  );
}
