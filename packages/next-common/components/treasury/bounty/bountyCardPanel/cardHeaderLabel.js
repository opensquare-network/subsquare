import React from "react";
import ActiveLabel from "./activeLabel";
import { MenuBounties } from "@osn/icons/subsquare";
import { cn } from "next-common/utils";

function CardHeaderLabel({ className = "" }) {
  return (
    <span
      className={cn("h-10 flex w-full justify-between items-center", className)}
    >
      <span className="inline-block flex w-10 h-10 items-center justify-center bg-neutral200 rounded-[8px]">
        <MenuBounties className="w-6 h-6 [&_path]:fill-textSecondary" />
      </span>
      <ActiveLabel />
    </span>
  );
}

export default React.memo(CardHeaderLabel);
