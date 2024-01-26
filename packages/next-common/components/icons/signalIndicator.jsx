import {
  SystemSignalActiveDark,
  SystemSignalActiveLight,
  SystemSignalInactiveDark,
  SystemSignalInactiveLight,
} from "@osn/icons/subsquare";
import Tooltip from "../tooltip";

export default function SignalIndicator({ active, className = "" }) {
  return (
    <Tooltip className={className} content={active ? "Active" : "Inactive"}>
      {active && (
        <>
          <SystemSignalActiveLight className="dark:hidden" />
          <SystemSignalActiveDark className="hidden dark:block" />
        </>
      )}

      {!active && (
        <>
          <SystemSignalInactiveLight className="dark:hidden" />
          <SystemSignalInactiveDark className="hidden dark:block" />
        </>
      )}
    </Tooltip>
  );
}
