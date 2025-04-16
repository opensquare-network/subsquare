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
import useTrackNameFromAction from "../memberPromotionPopup/voteButtons/useTrackNameFromAction";
import PrimaryButton from "next-common/lib/button/primary";
import Tooltip from "next-common/components/tooltip";
import {
  getMinRankOfClass,
  getTrackToPromoteRank,
} from "next-common/context/post/fellowship/useMaxVoters";
import { useRankedCollectivePallet } from "next-common/context/collectives/collectives";

function RankOption({ rank, myRank }) {
  const collectivePallet = useRankedCollectivePallet();
  const trackId = getTrackToPromoteRank(rank);
  const requiredRank = getMinRankOfClass(trackId, collectivePallet);

  if (requiredRank <= myRank) {
    return rank;
  }

  return (
    <Tooltip
      className="w-full"
      content={`Only rank >=${requiredRank} can create a referendum and then vote`}
    >
      <div className="text-textTertiary">{rank}</div>
    </Tooltip>
  );
}

function RankField({ minRank, myRank, rank, setRank = noop }) {
  const options = [1, 2, 3]
    .filter((r) => r > minRank)
    .map((r) => ({
      text: <RankOption rank={r} myRank={myRank} />,
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
  myRank,
  onClose,
}) {
  const dispatch = useDispatch();
  const [toRank, setToRank] = useState(rank + 1);
  const action = toRank > rank + 1 ? "promoteFast" : "promote";
  const trackName = useTrackNameFromAction(action, rank);
  const [enactment] = useState({ after: 100 });
  const collectivePallet = useRankedCollectivePallet();

  const { fetch: fetchActiveReferenda } = useActiveReferendaContext();
  const { value: address, component: whoField } = useAddressComboField({
    title: "Who",
    defaultAddress: who,
    readOnly: true,
  });

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

  const { doSubmit: doSubmitCreateAndVote } = useTxSubmission({
    getTxFunc: getCreateAndVoteTxFunc,
    onInBlock: () => {
      dispatch(newSuccessToast("Vote successfully"));
      fetchActiveReferenda();
    },
  });

  let disabled = !who || !toRank;
  let tooltipContent = "";
  const trackId = getTrackToPromoteRank(toRank);
  const requiredRank = getMinRankOfClass(trackId, collectivePallet);

  if (requiredRank > myRank) {
    disabled = true;
    tooltipContent = `Only rank >=${requiredRank} can create a referendum and then vote`;
  }

  return (
    <PopupWithSigner title="New Promote Referendum" onClose={onClose}>
      {whoField}
      <RankField
        title="To Rank"
        minRank={rank}
        myRank={myRank}
        rank={toRank}
        setRank={setToRank}
      />
      <div className="flex justify-end">
        <Tooltip content={tooltipContent}>
          <PrimaryButton disabled={disabled} onClick={doSubmitCreateAndVote}>
            Create & Vote
          </PrimaryButton>
        </Tooltip>
      </div>
    </PopupWithSigner>
  );
}
