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
import { useIsWatchOnly } from "next-common/context/connectedAccount";
import { WATCH_ONLY_TOOLTIP_TEXT } from "next-common/utils/watchOnly";

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
  const isWatchOnly = useIsWatchOnly();

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
    <Tooltip content={isWatchOnly ? WATCH_ONLY_TOOLTIP_TEXT : tooltip}>
      <ButtonComponent
        disabled={disabled || isWatchOnly}
        onClick={doSubmitCreateAndVote}
      >
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
