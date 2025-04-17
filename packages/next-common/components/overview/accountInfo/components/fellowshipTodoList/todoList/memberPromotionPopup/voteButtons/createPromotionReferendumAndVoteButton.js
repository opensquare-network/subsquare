import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { cn } from "next-common/utils";
import useTxSubmission from "next-common/components/common/tx/useTxSubmission";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import SecondaryButton from "next-common/lib/button/secondary";
import { useFellowshipProposalSubmissionTxFunc } from "next-common/hooks/fellowship/core/useFellowshipCoreMemberProposalSubmitTx";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";
import { useActiveReferendaContext } from "next-common/context/activeReferenda";
import dynamicPopup from "next-common/lib/dynamic/popup";
import Tooltip from "next-common/components/tooltip";
import { useChain } from "next-common/context/chain";
import { getPromoteTrackNameFromRank } from "next-common/components/fellowship/core/members/actions/promote/popup";
import useMemberRank from "./useMemberRank";

const CreatePromotionReferendaAndVotePopup = dynamicPopup(() =>
  import("../../createPromotionReferendaAndVotePopup"),
);

function CreateReferendumAndVoteButtonImpl({
  who,
  voteAye,
  disabled,
  tooltip,
  children,
}) {
  const [showMaybeFastPromotePopup, setShowMaybeFastPromotePopup] =
    useState(false);
  const dispatch = useDispatch();
  const currentRank = useMemberRank(who);

  const chain = useChain();
  const trackName = getPromoteTrackNameFromRank(chain, currentRank + 1);

  const [enactment] = useState({ after: 100 });
  const { fetch: fetchActiveReferenda } = useActiveReferendaContext();

  const getCreateAndVoteTxFunc = useFellowshipProposalSubmissionTxFunc({
    rank: currentRank + 1,
    who,
    action: "promote",
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
    if (currentRank < 3) {
      setShowMaybeFastPromotePopup(true);
      return;
    }
    doSubmitCreateAndVote();
  }, [currentRank, doSubmitCreateAndVote]);

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
      {showMaybeFastPromotePopup && (
        <CreatePromotionReferendaAndVotePopup
          who={who}
          voteAye={voteAye}
          onClose={() => setShowMaybeFastPromotePopup(false)}
        />
      )}
    </>
  );
}

export default function CreatePromotionReferendumAndVoteButton({
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
