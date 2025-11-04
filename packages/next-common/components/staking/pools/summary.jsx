import { isNil } from "lodash-es";
import SummaryLayout from "next-common/components/summary/layout/layout";
import ClaimableItem from "./claimableItem";
import WithdrawItem from "./withdrawItem";
import SummaryItem from "next-common/components/summary/layout/item";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import ValueDisplay from "next-common/components/valueDisplay";

export default function PoolsSummary({ myPool }) {
  const { decimals, symbol } = useChainSettings();
  if (isNil(myPool)) {
    return null;
  }

  return (
    <SummaryLayout>
      <SummaryItem title="My Pool">#{myPool?.poolId}</SummaryItem>
      <SummaryItem title="Bonded">
        <ValueDisplay
          value={toPrecision(myPool?.points, decimals)}
          symbol={symbol}
        />
      </SummaryItem>

      <ClaimableItem claimable={myPool?.claimable} />
      <WithdrawItem unbondingEras={myPool?.unbondingEras} />
    </SummaryLayout>
  );
}
