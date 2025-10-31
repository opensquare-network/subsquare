import { isNil } from "lodash-es";
import useMyPool from "./hooks/useMyPool";
import SummaryLayout from "next-common/components/summary/layout/layout";
import SummaryItem from "next-common/components/summary/layout/item";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import { useChainSettings } from "next-common/context/chain";

export default function PoolsSummary() {
  const { result: myPool } = useMyPool(true);
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
      <SummaryItem title="Claimable">
        <ValueDisplay
          value={toPrecision(myPool?.claimable, decimals)}
          symbol={symbol}
        />
      </SummaryItem>
    </SummaryLayout>
  );
}
