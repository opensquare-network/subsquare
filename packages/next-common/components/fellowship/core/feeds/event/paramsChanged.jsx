import { InfoDocs } from "@osn/icons/subsquare";
import noop from "lodash.noop";
import Tooltip from "next-common/components/tooltip";
import { cn } from "next-common/utils";
import { FellowshipCoreFeedEventLabel } from "./shared";

export default function FellowshipCoreFeedsParamsChangedEvent({
  setComparePopupVisible = noop,
}) {
  return (
    <>
      <span className="text-textPrimary">
        The Polkadot Collectives Fellowship
      </span>
      <FellowshipCoreFeedEventLabel>
        Params Changed
      </FellowshipCoreFeedEventLabel>
      <Tooltip content="Compare Params Changes">
        <InfoDocs
          role="button"
          className={cn(
            "w-4 h-4 relative top-[0.5px]",
            "[&_path]:stroke-textTertiary [&_path]:hover:stroke-textSecondary",
            "[&_path]:fill-textTertiary [&_path]:hover:fill-textSecondary",
          )}
          onClick={() => {
            setComparePopupVisible(true);
          }}
        />
      </Tooltip>
    </>
  );
}
