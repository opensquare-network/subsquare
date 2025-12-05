import { InfoDocs } from "@osn/icons/subsquare";
import Tooltip from "next-common/components/tooltip";
import { cn } from "next-common/utils";
import { FellowshipCoreFeedEventLabel } from "./shared";
import { useState } from "react";
import dynamicPopup from "next-common/lib/dynamic/popup";

const FellowshipCoreFeedsCompareParamsChangesPopup = dynamicPopup(() =>
  import("../compareParamsChangesPopup"),
);

export default function FellowshipCoreFeedsParamsChangedEvent({ feed }) {
  const [comparePopupVisible, setComparePopupVisible] = useState(false);
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

      {comparePopupVisible && (
        <FellowshipCoreFeedsCompareParamsChangesPopup
          feed={feed}
          onClose={() => {
            setComparePopupVisible(false);
          }}
        />
      )}
    </>
  );
}
