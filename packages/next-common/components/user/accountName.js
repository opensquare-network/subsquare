import React from "react";
import Tooltip from "../tooltip";
import Username from "./username";
import { cn } from "next-common/utils";

export default function AccountName({
  accountName,
  maxWidth,
  noTooltip,
  className = "",
}) {
  return (
    <div className={cn("flex items-center gap-[4px]", className)}>
      {maxWidth && !noTooltip ? (
        <Tooltip content={accountName}>
          <Username username={accountName} maxWidth={maxWidth} />
        </Tooltip>
      ) : (
        <Username username={accountName} maxWidth={maxWidth} />
      )}
    </div>
  );
}
