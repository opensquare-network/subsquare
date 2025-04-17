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
  getTrackToFastPromoteToRank,
  getTrackToPromoteToRank,
} from "next-common/context/post/fellowship/useMaxVoters";
import { useRankedCollectivePallet } from "next-common/context/collectives/collectives";

function useRequiredRankToPromoteMember(fromRank, toRank) {
  const collectivePallet = useRankedCollectivePallet();
  let trackId = getTrackToPromoteToRank(toRank);
  if (toRank - fromRank > 1) {
    trackId = getTrackToFastPromoteToRank(toRank);
  }
  return getMinRankOfClass(trackId, collectivePallet);
}

function RankOption({ fromRank, toRank, myRank }) {
  const requiredRank = useRequiredRankToPromoteMember(fromRank, toRank);
  if (requiredRank <= myRank) {
    return toRank;
  }

  return (
    <Tooltip
      className="w-full"
      content={`Only rank >=${requiredRank} can create a referendum and then vote`}
    >
      <div className="text-textTertiary">{toRank}</div>
    </Tooltip>
  );
}

function RankField({ fromRank, myRank, toRank, setToRank = noop }) {
  const options = [1, 2, 3]
    .filter((r) => r > fromRank)
    .map((r) => ({
      text: <RankOption fromRank={fromRank} toRank={r} myRank={myRank} />,
      value: r,
    }));

  return (
    <CommonSelectField
      title="To Rank"
      value={toRank}
      setValue={setToRank}
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
  const trackName = useTrackNameFromAction(action, toRank);
  const [enactment] = useState({ after: 100 });
  const requiredRank = useRequiredRankToPromoteMember(rank, toRank);

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
  if (requiredRank > myRank) {
    disabled = true;
    tooltipContent = `Only rank >=${requiredRank} can create a referendum and then vote`;
  }

  return (
    <PopupWithSigner title="New Promote Referendum" onClose={onClose}>
      {whoField}
      <RankField
        title="To Rank"
        fromRank={rank}
        myRank={myRank}
        toRank={toRank}
        setToRank={setToRank}
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
