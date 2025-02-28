import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import PopupWithSigner from "next-common/components/popupWithSigner";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import { useContextApi } from "next-common/context/api";
import { useRankedCollectivePallet } from "next-common/context/collectives/collectives";
import { useCallback, useState } from "react";
import { useReferendumVoting } from "next-common/context/fellowship/referendumVoting";
import { useOnchainData } from "next-common/context/post";
import { useDispatch } from "react-redux";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";
import { fetchFellowshipReferendumVotes2Times } from "next-common/context/fellowship/referendumVoting";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";

const successToastContent =
  "Votes in storage have been cleaned up. This button will disappear in a few seconds.";

function Content() {
  const { onClose } = usePopupParams();
  const api = useContextApi();
  const pallet = useRankedCollectivePallet();
  const { votes, fetch } = useReferendumVoting();
  const { referendumIndex: pollIndex } = useOnchainData();
  const dispatch = useDispatch();
  const [isDisabled, setIsDisabled] = useState(false);

  const getTxFunc = useCallback(() => {
    if (!api || !pallet) {
      return;
    }

    setIsDisabled(true);
    return api?.tx?.[pallet]?.cleanupPoll(pollIndex, votes.length);
  }, [api, pallet, pollIndex, votes]);

  const onInBlock = useCallback(async () => {
    dispatch(newSuccessToast(successToastContent));
    await fetchFellowshipReferendumVotes2Times(fetch);
  }, [dispatch, fetch]);

  return (
    <>
      <SignerWithBalance />
      <TxSubmissionButton
        title="Confirm"
        getTxFunc={getTxFunc}
        onInBlock={onInBlock}
        onSubmitted={onClose}
        disabled={isDisabled}
      />
    </>
  );
}

export default function CleanupPopup({ onClose }) {
  return (
    <PopupWithSigner title="Cleanup Poll" onClose={onClose}>
      <Content />
    </PopupWithSigner>
  );
}
