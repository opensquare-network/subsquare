import Button from "next-common/lib/button";
import { useCallback, useState } from "react";
import Tooltip from "next-common/components/tooltip";
import ReferendumCleanupPollProvider, {
  useReferendumCleanupPoll,
  useReferendumCleanupPollUpdate,
} from "next-common/context/fellowship/cleanupPoll";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import useTxSubmission from "next-common/components/common/tx/useTxSubmission";
import { useContextApi } from "next-common/context/api";
import { useRankedCollectivePallet } from "next-common/context/collectives/collectives";

function CleanupPollButton() {
  const { isFinished, votes, isLoading, pollIndex } =
    useReferendumCleanupPoll();
  const address = useRealAddress();
  const [isDisabled, setIsDisabled] = useState(false);
  const api = useContextApi();
  const pallet = useRankedCollectivePallet();

  const getTxFunc = useCallback(() => {
    if (!api || !address || !pollIndex || votes.length === 0 || !pallet) {
      return;
    }

    setIsDisabled(true);

    return api?.tx?.[pallet]?.cleanupPoll(pollIndex, votes.length);
  }, [api, address, pollIndex, votes, pallet]);

  const onInBlock = useReferendumCleanupPollUpdate();

  const { doSubmit } = useTxSubmission({
    getTxFunc,
    onInBlock,
    onCancelled: () => setIsDisabled(false),
  });

  if (!isFinished || votes.length === 0 || isLoading || !address) {
    return null;
  }

  return (
    <Tooltip content="Remove votes from storage, no gas">
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

export default function FellowshipReferendumCleanupPoll() {
  return (
    <ReferendumCleanupPollProvider>
      <SignerPopupWrapper>
        <CleanupPollButton />
      </SignerPopupWrapper>
    </ReferendumCleanupPollProvider>
  );
}
