import WarningInfoPanel from "next-common/components/summary/styled/warningInfoPanel";
import { useOnchainData } from "next-common/context/post";

export default function CallUnavailableWarning() {
  const { isCallUnavailable } = useOnchainData();

  if (!isCallUnavailable) {
    return null;
  }

  return (
    <WarningInfoPanel className="mt-3 !text12Medium">
      <span>The call was not found when execution</span>
    </WarningInfoPanel>
  );
}
