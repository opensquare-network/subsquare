import React from "react";
import Balance from "./balance";
import Curator from "./curator";
import { cn } from "next-common/utils";

function CardBalanceAndCurator({ item, className = "", showBadge = true }) {
  const { meta, value, address } = item?.onchainData ?? {};
  const curator = meta?.status?.active?.curator;

  return (
    <span className={cn("mt-4 mb-3 flex", className)}>
      <Balance address={address} value={value} />
      <Curator item={item} showBadge={showBadge} curator={curator} />
    </span>
  );
}

export default React.memo(CardBalanceAndCurator);
