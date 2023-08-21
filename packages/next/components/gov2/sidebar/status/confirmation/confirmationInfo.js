import { useConfirm } from "next-common/context/post/gov2/track";
import { ProgressInfo } from "../styled";
import TimeDuration from "next-common/components/TimeDuration";
import ConfirmAttempts from "./confirmAttempts";
import React from "react";

export const ConfirmInfoContext = React.createContext();

export default function ConfirmationInfo() {
  const confirmPeriod = useConfirm();

  return (
    <ProgressInfo>
      <div className="flex flex-col grow gap-[4px]">
        <div className="flex justify-between">
          <span>Confirmation</span>
          <span>
            <TimeDuration blocks={confirmPeriod} />
          </span>
        </div>
        <ConfirmAttempts />
      </div>
    </ProgressInfo>
  );
}
