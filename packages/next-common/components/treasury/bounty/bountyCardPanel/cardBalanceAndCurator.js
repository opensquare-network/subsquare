import React from "react";
import Balance from "./balance";
import Curator from "./curator";
import { cn } from "next-common/utils";

function CardBalanceAndCurator({ item, className = "", showBadge = true }) {
  return (
    <span className={cn("mt-4 mb-3 flex", className)}>
      <Balance />
      <Curator item={item} showBadge={showBadge} />
    </span>
  );
}

export default React.memo(CardBalanceAndCurator);
