import { useState } from "react";
import { useDispatch } from "react-redux";
import { cn } from "next-common/utils";
import useTxSubmission from "next-common/components/common/tx/useTxSubmission";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import SecondaryButton from "next-common/lib/button/secondary";
import { useFellowshipProposalSubmissionTxFunc } from "next-common/hooks/fellowship/core/useFellowshipCoreMemberProposalSubmitTx";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";
import { useActiveReferendaContext } from "next-common/context/activeReferenda";
import Tooltip from "next-common/components/tooltip";
import { useChain } from "next-common/context/chain";
import { getRetainTrackNameFromRank } from "next-common/components/fellowship/core/members/actions/approve/popup";

function CreateReferendumAndVoteButtonImpl({
  address,
  currentRank,
  voteAye,
  disabled,
  tooltip,
  children,
}) {
  const dispatch = useDispatch();
  const chain = useChain();
  const trackName = getRetainTrackNameFromRank(chain, currentRank);

  const [enactment] = useState({ after: 100 });
  const { fetch: fetchActiveReferenda } = useActiveReferendaContext();

  const getCreateAndVoteTxFunc = useFellowshipProposalSubmissionTxFunc({
    rank: currentRank,
    who: address,
    action: "approve",
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

  return (
    <Tooltip content={tooltip}>
      <SecondaryButton
        disabled={disabled}
        className={cn(
          "p-[6px]",
          disabled && "[&_svg_path]:stroke-textDisabled",
        )}
        size="small"
        onClick={doSubmitCreateAndVote}
      >
        {children}
      </SecondaryButton>
    </Tooltip>
  );
}

export default function CreateRetentionReferendumAndVoteButton({
  children,
  ...props
}) {
  return (
    <SignerPopupWrapper>
      <CreateReferendumAndVoteButtonImpl {...props}>
        {children}
      </CreateReferendumAndVoteButtonImpl>
    </SignerPopupWrapper>
  );
}
