import React from "react";
import {
  SystemSignalFrozen,
  SystemSignalDestroying,
} from "@osn/icons/subsquare";
import SignalIndicator from "next-common/components/icons/signalIndicator";
import Tooltip from "next-common/components/tooltip";

export const colStatus = {
  name: "",
  style: { textAlign: "right", width: "40px", minWidth: "40px" },
  render: (item) => (
    <div key="status" className="flex items-center">
      <Tooltip content={item.status || "Unknown"}>
        {item.status === "Live" ? (
          <SignalIndicator className="w-[16px] h-[16px]" active={true} />
        ) : item.status === "Frozen" ? (
          <SystemSignalFrozen width={16} height={16} />
        ) : item.status === "Destroying" ? (
          <SystemSignalDestroying width={16} height={16} />
        ) : null}
      </Tooltip>
    </div>
  ),
};
