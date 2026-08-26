import WarningInfoPanel from "next-common/components/summary/styled/warningInfoPanel";
import Tooltip from "next-common/components/tooltip";
import ToastWarning from "next-common/assets/imgs/icons/toast-warning.svg";
import { useOnchainData } from "next-common/context/post";
import { gov2State } from "next-common/utils/consts/state";

const enactmentErrorMessages = {
  CallUnavailable: "The call was not found when execution.",
  PermanentlyOverweight: "Execution failed due to overweight.",
};

export function EnactmentErrorIndicator({ data }) {
  const state = data?.onchainData?.state?.name;
  const message = enactmentErrorMessages[data?.onchainData?.enactmentError];

  if (gov2State.Approved !== state || !message) {
    return null;
  }

  return (
    <div className="flex items-center">
      <Tooltip
        content={message}
        className="flex shrink-0 items-center leading-none"
        side="top"
      >
        <span className="flex cursor-help items-center">
          <ToastWarning className="block" />
        </span>
      </Tooltip>
    </div>
  );
}

export default function EnactmentErrorWarning() {
  const { enactmentError } = useOnchainData();
  const message = enactmentErrorMessages[enactmentError];

  if (!message) {
    return null;
  }

  return (
    <WarningInfoPanel className="mt-3 !text12Medium">
      <span>{message}</span>
    </WarningInfoPanel>
  );
}
