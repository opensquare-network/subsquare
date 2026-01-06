import { useState } from "react";
import { isNil } from "lodash-es";
import { SystemMenu } from "@osn/icons/subsquare";
import SecondaryButton from "next-common/lib/button/secondary";
import dynamicPopup from "next-common/lib/dynamic/popup";
import Tooltip from "next-common/components/tooltip";
import pluralize from "pluralize";

const CoreDetailPopup = dynamicPopup(() => import("../popup/detailPopup"));

export default function ActionColumn({ item }) {
  const [showPopup, setShowPopup] = useState(false);

  const hasWorkplans = !isNil(item.workplans) && item.workplans.length > 0;

  return (
    <>
      <Tooltip
        content={
          hasWorkplans
            ? `Show ${pluralize("workplan", item.workplans.length)}`
            : "No workplan"
        }
      >
        <SecondaryButton
          disabled={!hasWorkplans}
          className="w-7 h-7 p-0"
          onClick={() => setShowPopup(true)}
        >
          <SystemMenu className="w-4 h-4" />
        </SecondaryButton>
      </Tooltip>
      {showPopup && (
        <CoreDetailPopup core={item} onClose={() => setShowPopup(false)} />
      )}
    </>
  );
}
