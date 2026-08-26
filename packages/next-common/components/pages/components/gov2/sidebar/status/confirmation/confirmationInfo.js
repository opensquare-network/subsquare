import { useConfirmPeriod } from "next-common/context/post/gov2/track";
import { ProgressInfo } from "../styled";
import TimeDurationWithBlockTime from "next-common/components/TimeDurationWithBlockTime";
import useReferendumBlockTime from "next-common/hooks/referenda/useReferendumBlockTime";
import ConfirmAttempts from "./confirmAttempts";
import React from "react";
import Tooltip from "next-common/components/tooltip";

function ConfirmPeriod() {
  const confirmPeriod = useConfirmPeriod();
  const blockTime = useReferendumBlockTime();

  return (
    <div className="flex justify-between">
      <Tooltip
        className="cursor-pointer"
        contentClassName="max-w-[240px]"
        content="The period after a proposal passes where it must remain unchallenged. If no one cancels it, the proposal is confirmed and executed."
      >
        <span>Confirmation</span>
      </Tooltip>
      <span>
        <TimeDurationWithBlockTime
          blocks={confirmPeriod}
          blockTime={blockTime}
        />
      </span>
    </div>
  );
}

export default function ConfirmationInfo() {
  return (
    <ProgressInfo>
      <div className="flex flex-col grow gap-[4px]">
        <ConfirmPeriod />
        <ConfirmAttempts />
      </div>
    </ProgressInfo>
  );
}
