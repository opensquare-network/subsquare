import Button from "next-common/lib/button";
import { useState, useMemo } from "react";
import Tooltip from "next-common/components/tooltip";
import ReferendumVotingProvider, {
  useReferendumVoting,
} from "next-common/context/fellowship/referendumVoting";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useReferendumVotingFinishIndexer } from "next-common/context/post/referenda/useReferendumVotingFinishHeight";
import { isNil } from "lodash-es";
import { useOnchainData } from "next-common/context/post";
import dynamicPopup from "next-common/lib/dynamic/popup";

const CleanupPopup = dynamicPopup(() => import("./popup"));

function CleanupPollButton() {
  const { votes, isLoading } = useReferendumVoting();
  const address = useRealAddress();
  const [showPopup, setShowPopup] = useState(false);

  const showCleanup = useMemo(() => {
    return votes?.length > 0 && !isLoading && address;
  }, [votes, isLoading, address]);

  if (!showCleanup) {
    return null;
  }

  return (
    <>
      <Tooltip content="Clean up votes from storage, no gas">
        <Button
          className="w-full h-[40px] rounded-lg bg-neutral100 border border-neutral400"
          onClick={() => setShowPopup(true)}
        >
          Cleanup Poll
        </Button>
      </Tooltip>
      {showPopup && <CleanupPopup onClose={() => setShowPopup(false)} />}
    </>
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
        <CleanupPollButton />
      </ReferendumVotingProvider>
    </MakesureReferendumFinishedGuard>
  );
}
