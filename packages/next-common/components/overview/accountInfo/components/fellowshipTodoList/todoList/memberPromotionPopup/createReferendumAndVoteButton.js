import useTxSubmission from "next-common/components/common/tx/useTxSubmission";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import SecondaryButton from "next-common/lib/button/secondary";
import { useFellowshipCoreMemberProposalSubmitTx } from "next-common/hooks/fellowship/core/useFellowshipCoreMemberProposalSubmitTx";
import { useChain } from "next-common/context/chain";
import { getRetainTrackNameFromRank } from "next-common/components/fellowship/core/members/actions/approve/popup";
import { useCallback, useState } from "react";
import { useContextApi } from "next-common/context/api";
import { isNil } from "lodash-es";
import { useRankedCollectivePallet } from "next-common/context/collectives/collectives";
import { getPromoteTrackNameFromRank } from "next-common/components/fellowship/core/members/actions/promote/popup";
import { cn } from "next-common/utils";
import { useDispatch } from "react-redux";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";

function useTrackNameFromAction(action, currentMemberRank) {
  const chain = useChain();
  if (action === "approve") {
    return getRetainTrackNameFromRank(chain, currentMemberRank);
  } else if (action === "promote") {
    return getPromoteTrackNameFromRank(chain, currentMemberRank + 1);
  }

  throw new Error("Unsupported action");
}

function CreateReferendumAndVoteButtonImpl({
  address,
  rank,
  referendumIndex,
  action = "promote",
  voteAye,
  disabled,
  children,
}) {
  const dispatch = useDispatch();
  const api = useContextApi();
  const trackName = useTrackNameFromAction(action, rank);
  const collectivePallet = useRankedCollectivePallet();
  const [enactment] = useState({ after: 100 });

  const createAndVoteTxFunc = useFellowshipCoreMemberProposalSubmitTx({
    rank,
    who: address,
    action,
    trackName,
    enactment,
    checkDecisionDeposit: true,
    checkVoteAye: true,
    voteAye,
  });

  const voteTxFunc = useCallback(() => {
    return api.tx[collectivePallet].vote(referendumIndex, voteAye);
  }, [api, collectivePallet, referendumIndex, voteAye]);

  const { doSubmit: doSubmitCreateAndVote } = useTxSubmission({
    getTxFunc: createAndVoteTxFunc,
    onInBlock: () => {
      dispatch(newSuccessToast("Vote successfully"));
    },
  });

  const { doSubmit: doSubmitVote } = useTxSubmission({
    getTxFunc: voteTxFunc,
    onInBlock: () => {
      dispatch(newSuccessToast("Vote successfully"));
    },
  });

  return (
    <SecondaryButton
      disabled={disabled}
      className={cn("p-[6px]", disabled && "[&_svg_path]:stroke-textDisabled")}
      size="small"
      onClick={isNil(referendumIndex) ? doSubmitCreateAndVote : doSubmitVote}
    >
      {children}
    </SecondaryButton>
  );
}

export default function CreateReferendumAndVoteButton({ children, ...props }) {
  return (
    <SignerPopupWrapper>
      <CreateReferendumAndVoteButtonImpl {...props}>
        {children}
      </CreateReferendumAndVoteButtonImpl>
    </SignerPopupWrapper>
  );
}
