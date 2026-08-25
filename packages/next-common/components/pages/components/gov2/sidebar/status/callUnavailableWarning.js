import { SystemWarning } from "@osn/icons/subsquare";
import WarningInfoPanel from "next-common/components/summary/styled/warningInfoPanel";
import { useOnchainData } from "next-common/context/post";

export default function CallUnavailableWarning() {
  const { isCallUnavailable } = useOnchainData();

  if (!isCallUnavailable) {
    return null;
  }

  return (
    <WarningInfoPanel
      className="mt-3 items-start !gap-2 !px-3 !py-2 !text12Medium"
      role="alert"
    >
      <SystemWarning
        aria-hidden="true"
        className="mt-px shrink-0"
        height={16}
        width={16}
      />
      <span>
        The call for the provided hash was not found so the task has been
        aborted.
      </span>
    </WarningInfoPanel>
  );
}
