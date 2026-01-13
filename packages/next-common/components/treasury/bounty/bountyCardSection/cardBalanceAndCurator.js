import React from "react";
import Balance from "./balance";
import Curator from "./curator";
import { cn } from "next-common/utils";
import { isNil } from "lodash-es";
import SummaryLayout from "next-common/components/summary/layout/layout";
import SummaryItem from "next-common/components/summary/layout/item";
import { useCurator } from "next-common/context/treasury/bounties";

function CardBalanceAndCurator({ item, className = "" }) {
  const { address } = item?.onchainData ?? {};
  const curator = useCurator();
  if (isNil(address)) return null;

  return (
    <SummaryLayout className={cn("mt-4 mb-3 flex", className)}>
      <SummaryItem title="Balance">
        <Balance address={address} />
      </SummaryItem>
      <SummaryItem title="Curator">
        {curator ? <Curator /> : <span className="text12Medium">-</span>}
      </SummaryItem>
    </SummaryLayout>
  );
}

export default React.memo(CardBalanceAndCurator);
