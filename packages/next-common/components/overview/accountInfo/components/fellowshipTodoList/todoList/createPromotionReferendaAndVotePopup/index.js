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
import useMemberRank from "../memberPromotionPopup/voteButtons/useMemberRank";
import { isNil } from "lodash-es";
import { useIsWatchOnly } from "next-common/context/connectedAccount";
import { WATCH_ONLY_TOOLTIP_TEXT } from "next-common/utils/watchOnly";

export default function CreatePromotionReferendaAndVotePopup({
  who,
  voteAye,
  onClose,
}) {
  const dispatch = useDispatch();

  const { fetch: fetchActiveReferenda } = useActiveReferendaContext();
  const { component: whoField } = useAddressComboField({
    title: "Who",
    defaultAddress: who,
    readOnly: true,
  });

  const { rank: evidenceOwnerRank } = useMemberRank(who);
  const [toRank, setToRank] = useState(evidenceOwnerRank + 1);
  const [enactment] = useState({ after: 100 });
  const isWatchOnly = useIsWatchOnly();

  const requiredRank = useRequiredRankToPromoteMember(
    evidenceOwnerRank,
    toRank,
  );
  const { rank: myRank } = useMyRank();

  const chain = useChain();
  const action = toRank > evidenceOwnerRank + 1 ? "promoteFast" : "promote";
  let trackName = getPromoteTrackNameFromRank(chain, toRank);
  if (action === "promoteFast") {
    trackName = getFastPromoteTrackNameFromRank(chain, toRank);
  }

  const getCreateAndVoteTxFunc = useFellowshipProposalSubmissionTxFunc({
    rank: toRank,
    who,
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
  if (isNil(myRank) || requiredRank > myRank) {
    disabled = true;
    tooltipContent = `Only rank >= ${requiredRank} can create a referendum and then vote`;
  }
  if (isWatchOnly) {
    disabled = true;
    tooltipContent = WATCH_ONLY_TOOLTIP_TEXT;
  }

  return (
    <PopupWithSigner title="New Promote Referendum" onClose={onClose}>
      {whoField}
      <RankField
        title="To Rank"
        currentRank={evidenceOwnerRank}
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
