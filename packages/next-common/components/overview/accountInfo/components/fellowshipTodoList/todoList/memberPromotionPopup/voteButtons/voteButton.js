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
import useSubFellowshipReferendum from "next-common/hooks/collectives/useSubFellowshipReferendum";
import Tooltip from "next-common/components/tooltip";
import { getMinRankOfClass } from "next-common/context/post/fellowship/useMaxVoters";
import { isNil } from "lodash-es";
import { useMyVotesChangedContext } from "../../../context/myVotesChanged";

function VoteButtonImpl({ referendumIndex, voteAye, children }) {
  const dispatch = useDispatch();
  const api = useContextApi();
  const collectivePallet = useRankedCollectivePallet();
  const realAddress = useRealAddress();
  const rank = useFellowshipMemberRank(realAddress, collectivePallet);
  const { result: referendumInfo, loading: isReferendumInfoLoading } =
    useSubFellowshipReferendum(referendumIndex);
  const { triggerMyVotesChanged } = useMyVotesChangedContext();

  const voteTxFunc = useCallback(() => {
    return api.tx[collectivePallet].vote(referendumIndex, voteAye);
  }, [api, collectivePallet, referendumIndex, voteAye]);

  const { doSubmit: doSubmitVote } = useTxSubmission({
    getTxFunc: voteTxFunc,
    onInBlock: () => {
      dispatch(newSuccessToast("Vote successfully"));
      triggerMyVotesChanged();
    },
  });

  let disabled = false;
  let tooltipContent = "";
  if (!isReferendumInfoLoading && referendumInfo) {
    try {
      const track = referendumInfo.unwrap()?.asOngoing?.track;
      if (!isNil(track)) {
        const requiredRank = getMinRankOfClass(track, collectivePallet);
        disabled = requiredRank > rank;
        if (disabled) {
          tooltipContent = `Only rank >= ${requiredRank} can vote`;
        }
      }
    } catch (e) {
      console.error(e);
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
