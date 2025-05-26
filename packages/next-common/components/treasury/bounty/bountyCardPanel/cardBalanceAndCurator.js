import React from "react";
import Balance from "./balance";
import Curator from "./curator";
import { cn } from "next-common/utils";
import { isNil } from "lodash-es";

function CardBalanceAndCurator({ item, className = "", showBadge = true }) {
  const { meta, address } = item?.onchainData ?? {};
  const curator = meta?.status?.active?.curator;
  if (isNil(meta) || isNil(address) || isNil(curator)) return null;

  return (
    <span className={cn("mt-4 mb-3 flex", className)}>
      <Balance address={address} />
      <Curator item={item} showBadge={showBadge} curator={curator} />
    </span>
  );
}

export default React.memo(CardBalanceAndCurator);
