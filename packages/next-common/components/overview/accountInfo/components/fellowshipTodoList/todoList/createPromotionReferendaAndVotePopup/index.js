import { useState } from "react";
import { noop } from "lodash-es";
import CommonSelectField from "next-common/components/popup/fields/commonSelectField";
import PopupWithSigner from "next-common/components/popupWithSigner";
import useAddressComboField from "next-common/components/preImages/createPreimagePopup/fields/useAddressComboField";
import { useFellowshipProposalSubmissionTxFunc } from "next-common/hooks/fellowship/core/useFellowshipCoreMemberProposalSubmitTx";
import useTxSubmission from "next-common/components/common/tx/useTxSubmission";
import { useDispatch } from "react-redux";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";
import { useActiveReferendaContext } from "next-common/context/activeReferenda";
import useTrackNameFromAction from "../memberPromotionPopup/useTrackNameFromAction";
import PrimaryButton from "next-common/lib/button/primary";

function RankField({ rank, setRank = noop }) {
  const options = [1, 2, 3].map((r) => ({
    text: r,
    value: r,
  }));
  return (
    <CommonSelectField
      title="To Rank"
      value={rank}
      setValue={setRank}
      options={options}
    />
  );
}

export default function CreatePromotionReferendaAndVotePopup({
  who,
  voteAye,
  rank,
  onClose,
}) {
  const dispatch = useDispatch();
  const [toRank, setToRank] = useState(rank + 1);
  const action = toRank > rank + 1 ? "promoteFast" : "promote";
  const trackName = useTrackNameFromAction(action, rank);
  const [enactment] = useState({ after: 100 });

  const { fetch: fetchActiveReferenda } = useActiveReferendaContext();
  const { value: address, component: whoField } = useAddressComboField({
    title: "Who",
    defaultAddress: who,
    readOnly: true,
  });

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

  return (
    <PopupWithSigner title="New Promote Referendum" onClose={onClose}>
      {whoField}
      <RankField title="To Rank" rank={toRank} setRank={setToRank} />
      <div className="flex justify-end">
        <PrimaryButton
          disabled={!who || !toRank}
          onClick={doSubmitCreateAndVote}
        >
          Create & Vote
        </PrimaryButton>
      </div>
    </PopupWithSigner>
  );
}
