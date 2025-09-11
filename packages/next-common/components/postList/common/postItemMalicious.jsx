import React from "react";
import Tooltip from "next-common/components/tooltip";
import WarningIcon from "next-common/assets/imgs/icons/warning.svg";

export default function PostItemMalicious({ isMalicious }) {
  if (!isMalicious) {
    return null;
  }
  return (
    <div className="flex items-center">
      <Tooltip content="Warning: Malicious proposal!">
        <WarningIcon />
      </Tooltip>
    </div>
  );
}
