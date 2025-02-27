import Button from "next-common/lib/button";
import { useCallback } from "react";
import Tooltip from "next-common/components/tooltip";
import FellowshipReferendumPollCleanupProvider, {
  useFellowshipReferendumCleanupPoll,
} from "next-common/context/fellowshipReferendumCleanup";
import useRealAddress from "next-common/utils/hooks/useRealAddress";

function CleanupPollButton() {
  const onClick = useCallback(() => {}, []);
  const { isFinished, votes, isLoading } = useFellowshipReferendumCleanupPoll();
  const userAddress = useRealAddress();

  if (!isFinished || votes.length === 0 || isLoading || !userAddress) {
    return null;
  }

  return (
    <Tooltip content="Remove votes from storage, no gas">
      <Button
        className={
          "w-full h-[40px] rounded-lg bg-neutral100 border border-neutral400"
        }
        onClick={onClick}
      >
        Cleanup Poll
      </Button>
    </Tooltip>
  );
}

export default function FellowshipReferendumCleanupPoll() {
  return (
    <FellowshipReferendumPollCleanupProvider>
      <CleanupPollButton />
    </FellowshipReferendumPollCleanupProvider>
  );
}
