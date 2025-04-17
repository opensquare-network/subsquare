import { useState } from "react";
import PopupWithSigner from "next-common/components/popupWithSigner";
import useAddressComboField from "next-common/components/preImages/createPreimagePopup/fields/useAddressComboField";
import { useFellowshipProposalSubmissionTxFunc } from "next-common/hooks/fellowship/core/useFellowshipCoreMemberProposalSubmitTx";
import useTxSubmission from "next-common/components/common/tx/useTxSubmission";
import { useDispatch } from "react-redux";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";
import { useActiveReferendaContext } from "next-common/context/activeReferenda";
import PrimaryButton from "next-common/lib/button/primary";
import Tooltip from "next-common/components/tooltip";
import useMyRank from "../memberPromotionPopup/voteButtons/useMyRank";
import { useChain } from "next-common/context/chain";
import { getPromoteTrackNameFromRank } from "next-common/components/fellowship/core/members/actions/promote/popup";
import getFastPromoteTrackNameFromRank from "../memberPromotionPopup/voteButtons/getFastPromoteTrackNameFromRank";
import useRequiredRankToPromoteMember from "./useRequiredRankToPromoteMember";
import RankField from "./rankField";

export default function CreatePromotionReferendaAndVotePopup({
  who,
  voteAye,
  currentRank,
  onClose,
}) {
  const dispatch = useDispatch();
  const chain = useChain();
  const [toRank, setToRank] = useState(currentRank + 1);

  const [enactment] = useState({ after: 100 });
  const requiredRank = useRequiredRankToPromoteMember(currentRank, toRank);
  const myRank = useMyRank();

  const { fetch: fetchActiveReferenda } = useActiveReferendaContext();
  const { value: address, component: whoField } = useAddressComboField({
    title: "Who",
    defaultAddress: who,
    readOnly: true,
  });

  const action = toRank > currentRank + 1 ? "promoteFast" : "promote";
  let trackName = getPromoteTrackNameFromRank(chain, toRank);
  if (action === "promoteFast") {
    trackName = getFastPromoteTrackNameFromRank(chain, toRank);
  }

  const getCreateAndVoteTxFunc = useFellowshipProposalSubmissionTxFunc({
    rank: toRank,
    who: address,
    action,
    trackName,
    enactment,
    checkDecisionDeposit: true,
    checkVoteAye: true,
    voteAye,
  });

  const { doSubmit: doSubmitCreateAndVote, isSubmitting } = useTxSubmission({
    getTxFunc: getCreateAndVoteTxFunc,
    onSubmitted: onClose,
    onInBlock: () => {
      dispatch(newSuccessToast("Vote successfully"));
      fetchActiveReferenda();
    },
  });

  let disabled = !who || !toRank;
  let tooltipContent = "";
  if (requiredRank > myRank) {
    disabled = true;
    tooltipContent = `Only rank >=${requiredRank} can create a referendum and then vote`;
  }

  return (
    <PopupWithSigner title="New Promote Referendum" onClose={onClose}>
      {whoField}
      <RankField
        title="To Rank"
        currentRank={currentRank}
        selectedRank={toRank}
        setSelectedRank={setToRank}
      />
      <div className="flex justify-end">
        <Tooltip content={tooltipContent}>
          <PrimaryButton
            disabled={disabled}
            loading={isSubmitting}
            onClick={doSubmitCreateAndVote}
          >
            Create & Vote
          </PrimaryButton>
        </Tooltip>
      </div>
    </PopupWithSigner>
  );
}
