import CuratorInfoItem from "./curatorInfoItem";
import React from "react";
import useBountyCurator from "./hooks/useBountyCurator";
import { useCuratorMultisigAddress } from "next-common/hooks/treasury/bounty/useCuratorMultisigAddress";

function Curator({ item, showBadge = true }) {
  const curator = useBountyCurator(item?.bountyIndex);
  const { badge } = useCuratorMultisigAddress(curator);
  return (
    <span className="flex-1 items-center">
      <span className="flex flex-col">
        <span className="text-textTertiary text12Medium">Curator</span>
        <span className="mt-1">
          <CuratorInfoItem data={item} badge={badge} showBadge={showBadge} />
        </span>
      </span>
    </span>
  );
}

export default Curator;
