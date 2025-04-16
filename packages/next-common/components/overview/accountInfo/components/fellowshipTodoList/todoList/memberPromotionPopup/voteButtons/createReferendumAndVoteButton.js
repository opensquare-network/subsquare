import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { cn } from "next-common/utils";
import useTxSubmission from "next-common/components/common/tx/useTxSubmission";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import SecondaryButton from "next-common/lib/button/secondary";
import { useFellowshipProposalSubmissionTxFunc } from "next-common/hooks/fellowship/core/useFellowshipCoreMemberProposalSubmitTx";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";
import { useActiveReferendaContext } from "next-common/context/activeReferenda";
import useTrackNameFromAction from "./useTrackNameFromAction";
import dynamicPopup from "next-common/lib/dynamic/popup";
import Tooltip from "next-common/components/tooltip";

const CreatePromotionReferendaAndVotePopup = dynamicPopup(() =>
  import("../../createPromotionReferendaAndVotePopup"),
);

function CreateReferendumAndVoteButtonImpl({
  address,
  rank,
  myRank,
  action = "promote",
  voteAye,
  disabled,
  tooltip,
  children,
}) {
  const [
    showCreatePromotionReferendaAndVotePopup,
    setShowCreatePromotionReferendaAndVotePopup,
  ] = useState(false);
  const dispatch = useDispatch();
  const trackName = useTrackNameFromAction(action, rank);
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

  return (
    <>
      <Tooltip content={tooltip}>
        <SecondaryButton
          disabled={disabled}
          className={cn(
            "p-[6px]",
            disabled && "[&_svg_path]:stroke-textDisabled",
          )}
          size="small"
          onClick={createReferendaAndVote}
        >
          {children}
        </SecondaryButton>
      </Tooltip>
      {showCreatePromotionReferendaAndVotePopup && (
        <CreatePromotionReferendaAndVotePopup
          rank={rank}
          myRank={myRank}
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
