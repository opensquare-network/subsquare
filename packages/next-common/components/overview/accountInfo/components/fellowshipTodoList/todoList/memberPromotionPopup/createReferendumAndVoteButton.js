import useTxSubmission from "next-common/components/common/tx/useTxSubmission";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import SecondaryButton from "next-common/lib/button/secondary";
import { useFellowshipProposalSubmissionTxFunc } from "next-common/hooks/fellowship/core/useFellowshipCoreMemberProposalSubmitTx";
import { useCallback, useState } from "react";
import { useContextApi } from "next-common/context/api";
import { isNil } from "lodash-es";
import { useRankedCollectivePallet } from "next-common/context/collectives/collectives";
import { cn } from "next-common/utils";
import { useDispatch } from "react-redux";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";
import { useActiveReferendaContext } from "next-common/context/activeReferenda";
import useTrackNameFromAction from "./useTrackNameFromAction";
import dynamicPopup from "next-common/lib/dynamic/popup";

const CreatePromotionReferendaAndVotePopup = dynamicPopup(() =>
  import("../createPromotionReferendaAndVotePopup"),
);

function CreateReferendumAndVoteButtonImpl({
  address,
  rank,
  referendumIndex,
  action = "promote",
  voteAye,
  disabled,
  children,
}) {
  const [
    showCreatePromotionReferendaAndVotePopup,
    setShowCreatePromotionReferendaAndVotePopup,
  ] = useState(false);
  const dispatch = useDispatch();
  const api = useContextApi();
  const trackName = useTrackNameFromAction(action, rank);
  const collectivePallet = useRankedCollectivePallet();
  const [enactment] = useState({ after: 100 });
  const { fetch: fetchActiveReferenda } = useActiveReferendaContext();

  const getCreateAndVoteTxFunc = useFellowshipProposalSubmissionTxFunc({
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
    getTxFunc: getCreateAndVoteTxFunc,
    onInBlock: () => {
      dispatch(newSuccessToast("Vote successfully"));
      fetchActiveReferenda();
    },
  });

  const createReferendaAndVote = useCallback(() => {
    if (action === "promote" && rank < 3) {
      setShowCreatePromotionReferendaAndVotePopup(true);
      return;
    }
    doSubmitCreateAndVote();
  }, [action, rank, doSubmitCreateAndVote]);

  const { doSubmit: doSubmitVote } = useTxSubmission({
    getTxFunc: voteTxFunc,
    onInBlock: () => {
      dispatch(newSuccessToast("Vote successfully"));
    },
  });

  return (
    <>
      <SecondaryButton
        disabled={disabled}
        className={cn(
          "p-[6px]",
          disabled && "[&_svg_path]:stroke-textDisabled",
        )}
        size="small"
        onClick={isNil(referendumIndex) ? createReferendaAndVote : doSubmitVote}
      >
        {children}
      </SecondaryButton>
      {showCreatePromotionReferendaAndVotePopup && (
        <CreatePromotionReferendaAndVotePopup
          rank={rank}
          who={address}
          onClose={() => setShowCreatePromotionReferendaAndVotePopup(false)}
        />
      )}
    </>
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
