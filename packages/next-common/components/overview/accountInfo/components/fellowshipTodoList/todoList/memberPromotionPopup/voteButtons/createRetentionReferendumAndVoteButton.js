import { useState } from "react";
import { useDispatch } from "react-redux";
import useTxSubmission from "next-common/components/common/tx/useTxSubmission";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import { useFellowshipProposalSubmissionTxFunc } from "next-common/hooks/fellowship/core/useFellowshipCoreMemberProposalSubmitTx";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";
import { useActiveReferendaContext } from "next-common/context/activeReferenda";
import Tooltip from "next-common/components/tooltip";
import { useChain } from "next-common/context/chain";
import { getRetainTrackNameFromRank } from "next-common/components/fellowship/core/members/actions/approve/popup";
import useMemberRank from "./useMemberRank";
import { useMyVotesChangedContext } from "../../../context/myVotesChanged";
import SecondaryButton from "next-common/lib/button/secondary";

function CreateReferendumAndVoteButtonImpl({
  who,
  voteAye,
  disabled,
  tooltip,
  children,
  ButtonComponent = SecondaryButton,
}) {
  const dispatch = useDispatch();
  const currentRank = useMemberRank(who);
  const chain = useChain();
  const trackName = getRetainTrackNameFromRank(chain, currentRank);

  const [enactment] = useState({ after: 100 });
  const { fetch: fetchActiveReferenda } = useActiveReferendaContext();
  const { triggerMyVotesChanged } = useMyVotesChangedContext();

  const getCreateAndVoteTxFunc = useFellowshipProposalSubmissionTxFunc({
    rank: currentRank,
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
    <Tooltip content={tooltip}>
      <ButtonComponent disabled={disabled} onClick={doSubmitCreateAndVote}>
        {children}
      </ButtonComponent>
    </Tooltip>
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
