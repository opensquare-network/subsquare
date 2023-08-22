import { useConfirm } from "next-common/context/post/gov2/track";
import { ProgressInfo } from "../styled";
import TimeDuration from "next-common/components/TimeDuration";
import ConfirmAttempts from "./confirmAttempts";
import React from "react";

function ConfirmPeriod() {
  const confirmPeriod = useConfirm();

  return (
    <div className="flex justify-between">
      <span>Confirmation</span>
      <span>
        <TimeDuration blocks={confirmPeriod} />
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
