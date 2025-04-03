import React from "react";
import { SystemCheck } from "@osn/icons/subsquare";
import { cn } from "next-common/utils";

function NodeSelectedIcon({ selected, className = "" }) {
  if (!selected) return null;

  return (
    <SystemCheck
      className={cn(
        "w-5 h-5",
        className,
      )}
    />
  );
}

export default React.memo(NodeSelectedIcon);
