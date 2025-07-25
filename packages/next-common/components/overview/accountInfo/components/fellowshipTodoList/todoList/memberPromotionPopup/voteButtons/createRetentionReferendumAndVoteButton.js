import { useState } from "react";
import useTxSubmission from "next-common/components/common/tx/useTxSubmission";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import { useFellowshipProposalSubmissionTxFunc } from "next-common/hooks/fellowship/core/useFellowshipCoreMemberProposalSubmitTx";
import { useActiveReferendaContext } from "next-common/context/activeReferenda";
import Tooltip from "next-common/components/tooltip";
import { useChain } from "next-common/context/chain";
import { getRetainTrackNameFromRank } from "next-common/components/fellowship/core/members/actions/approve/popup";
import useMemberRank from "./useMemberRank";
import { useMyVotesChangedContext } from "../../../context/myVotesChanged";
import SecondaryButton from "next-common/lib/button/secondary";
import { useSmartTxToast } from "next-common/hooks/useMultisigTx";

function CreateReferendumAndVoteButtonImpl({
  who,
  voteAye,
  disabled,
  tooltip,
  children,
  ButtonComponent = SecondaryButton,
}) {
  const currentRank = useMemberRank(who);
  const chain = useChain();
  const trackName = getRetainTrackNameFromRank(chain, currentRank);
  const { smartToastAtInBlock } = useSmartTxToast();

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
      smartToastAtInBlock("Vote successfully");
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
