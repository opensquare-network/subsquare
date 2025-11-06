import { isNil } from "lodash-es";
import SummaryLayout from "next-common/components/summary/layout/layout";
import ClaimableItem from "./claimableItem";
import WithdrawItem from "./withdrawItem";
import SummaryItem from "next-common/components/summary/layout/item";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import ValueDisplay from "next-common/components/valueDisplay";
import { useMyPool } from "./context/myPool";

export default function PoolsSummary() {
  const { poolMember, claimable } = useMyPool();
  const { decimals, symbol } = useChainSettings();
  if (isNil(poolMember)) {
    return null;
  }

  return (
    <SummaryLayout>
      <SummaryItem title="My Pool">#{poolMember?.poolId}</SummaryItem>
      <SummaryItem title="Bonded">
        <ValueDisplay
          value={toPrecision(poolMember?.points, decimals)}
          symbol={symbol}
        />
      </SummaryItem>

      <ClaimableItem claimable={claimable} />
      <WithdrawItem unbondingEras={poolMember?.unbondingEras} />
    </SummaryLayout>
  );
}
