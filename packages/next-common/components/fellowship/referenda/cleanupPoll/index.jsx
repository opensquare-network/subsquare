import Button from "next-common/lib/button";
import { useCallback, useState, useMemo } from "react";
import Tooltip from "next-common/components/tooltip";
import ReferendumVotingProvider, {
  useReferendumVoting,
  fetchFellowshipReferendumVotes2Times,
} from "next-common/context/fellowship/referendumVoting";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import useTxSubmission from "next-common/components/common/tx/useTxSubmission";
import { useContextApi } from "next-common/context/api";
import { useRankedCollectivePallet } from "next-common/context/collectives/collectives";
import { useReferendumVotingFinishIndexer } from "next-common/context/post/referenda/useReferendumVotingFinishHeight";
import { isNil } from "lodash-es";
import { useOnchainData } from "next-common/context/post";
import { useDispatch } from "react-redux";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";

const successToastContent =
  "Votes in storage have been cleaned up. This button will disappear in a few seconds.";

function CleanupPollButton() {
  const { votes, isLoading, fetch } = useReferendumVoting();
  const { referendumIndex: pollIndex } = useOnchainData();
  const address = useRealAddress();
  const [isDisabled, setIsDisabled] = useState(false);
  const api = useContextApi();
  const pallet = useRankedCollectivePallet();
  const dispatch = useDispatch();

  const isCleanupEnabled = useMemo(() => {
    return votes?.length > 0 && !isLoading && address;
  }, [votes, isLoading, address]);

  const getTxFunc = useCallback(() => {
    if (!api || !pallet) {
      return;
    }
    setIsDisabled(true);

    return api?.tx?.[pallet]?.cleanupPoll(pollIndex, votes.length);
  }, [api, pallet, pollIndex, votes]);

  const onInBlock = () => {
    dispatch(newSuccessToast(successToastContent));
    fetchFellowshipReferendumVotes2Times(fetch).then(() => {
      // updated 2 time, do nothing
    });
  };

  const { doSubmit } = useTxSubmission({
    getTxFunc,
    onInBlock,
    onCancelled: () => setIsDisabled(false),
  });

  if (!isCleanupEnabled) {
    return null;
  }

  return (
    <Tooltip content="Clean up votes from storage, no gas">
      <Button
        className={
          "w-full h-[40px] rounded-lg bg-neutral100 border border-neutral400"
        }
        onClick={doSubmit}
        disabled={isDisabled}
      >
        Cleanup Poll
      </Button>
    </Tooltip>
  );
}

function MakesureReferendumFinishedGuard({ children }) {
  const finishedIndexer = useReferendumVotingFinishIndexer();
  const { referendumIndex } = useOnchainData();

  if (isNil(finishedIndexer) || isNil(referendumIndex)) {
    return null;
  }

  return children;
}

export default function FellowshipReferendumCleanupPoll() {
  return (
    <MakesureReferendumFinishedGuard>
      <ReferendumVotingProvider>
        <SignerPopupWrapper>
          <CleanupPollButton />
        </SignerPopupWrapper>
      </ReferendumVotingProvider>
    </MakesureReferendumFinishedGuard>
  );
}
