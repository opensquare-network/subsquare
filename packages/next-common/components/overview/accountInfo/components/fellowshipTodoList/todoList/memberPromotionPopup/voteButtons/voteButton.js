import { useCallback } from "react";
import { useDispatch } from "react-redux";
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

function VoteButtonImpl({
  referendumIndex,
  voteAye,
  children,
  ButtonComponent = SecondaryButton,
}) {
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
  let tooltipContent = voteAye ? "Vote Aye" : "Vote Nay";
  if (!isReferendumInfoLoading && referendumInfo) {
    try {
      const track = referendumInfo.unwrap()?.asOngoing?.track;
      if (!isNil(track)) {
        const requiredRank = getMinRankOfClass(track, collectivePallet);
        disabled = requiredRank > rank;
        if (disabled) {
          tooltipContent = `Only members with rank >= ${requiredRank} can vote`;
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <Tooltip content={tooltipContent}>
      <ButtonComponent disabled={disabled} onClick={doSubmitVote}>
        {children}
      </ButtonComponent>
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
