import { ArrowExternalLink } from "@osn/icons/subsquare";
import Tooltip from "next-common/components/tooltip";
import { useDotUsdTabs } from "./tabs";

// Switches to the tab of the list the number is summed from.
export default function RecordsLink({ tab, tooltip }) {
  const { setActiveTab } = useDotUsdTabs();

  return (
    <Tooltip className="inline-flex" content={tooltip}>
      <button
        type="button"
        aria-label={tooltip}
        onClick={() => setActiveTab(tab)}
        className="inline-flex items-center text-textTertiary hover:text-textSecondary"
      >
        <ArrowExternalLink className="w-3.5 h-3.5" />
      </button>
    </Tooltip>
  );
}
