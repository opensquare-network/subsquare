import Button from "next-common/lib/button";
import { useCallback } from "react";
import Tooltip from "next-common/components/tooltip";

export default function FellowshipReferendumCleanupPoll() {
  // TODO: implement this
  const isCanbeCleaned = true;
  const onClick = useCallback(() => {}, []);

  if (!isCanbeCleaned) {
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
