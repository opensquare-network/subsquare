import { useState } from "react";
import { useDispatch } from "react-redux";
import useTxSubmission from "next-common/components/common/tx/useTxSubmission";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import { useFellowshipProposalSubmissionTxFunc } from "next-common/hooks/fellowship/core/useFellowshipCoreMemberProposalSubmitTx";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";
import { useActiveReferendaContext } from "next-common/context/activeReferenda";
import { useChain } from "next-common/context/chain";
import { getRetainTrackNameFromRank } from "next-common/components/fellowship/core/members/actions/approve/popup";
import useMemberRank from "./useMemberRank";
import { useMyVotesChangedContext } from "../../../context/myVotesChanged";
import SecondaryButton from "next-common/lib/button/secondary";
import SubmitButton from "next-common/components/common/tx/submitButton";

function CreateReferendumAndVoteButtonImpl({
  who,
  voteAye,
  disabled,
  tooltip,
  children,
  ButtonComponent = SecondaryButton,
}) {
  const dispatch = useDispatch();
  const { rank: evidenceOwnerRank } = useMemberRank(who);
  const chain = useChain();
  const trackName = getRetainTrackNameFromRank(chain, evidenceOwnerRank);

  const [enactment] = useState({ after: 100 });
  const { fetch: fetchActiveReferenda } = useActiveReferendaContext();
  const { triggerMyVotesChanged } = useMyVotesChangedContext();

  const getCreateAndVoteTxFunc = useFellowshipProposalSubmissionTxFunc({
    rank: evidenceOwnerRank,
    who,
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
      triggerMyVotesChanged();
    },
  });

  return (
    <SubmitButton
      button={ButtonComponent}
      tooltip={tooltip}
      disabled={disabled}
      onClick={doSubmitCreateAndVote}
    >
      {children}
    </SubmitButton>
  );
}

export default function CreateRetentionReferendumAndVoteButton({
  children,
  ...props
}) {
  const ButtonComponent = props.ButtonComponent || SecondaryButton;
  return (
    <SignerPopupWrapper loadingContent={<ButtonComponent disabled={true} />}>
      <CreateReferendumAndVoteButtonImpl {...props}>
        {children}
      </CreateReferendumAndVoteButtonImpl>
    </SignerPopupWrapper>
  );
}
