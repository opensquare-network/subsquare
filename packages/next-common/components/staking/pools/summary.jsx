import { isNil } from "lodash-es";
import useMyPool from "./hooks/useMyPool";
import SummaryLayout from "next-common/components/summary/layout/layout";
import SummaryItem from "next-common/components/summary/layout/item";
import ClaimableItem from "./claimableItem";
import BondedItem from "./bondedItem";

export default function PoolsSummary() {
  const { result: myPool } = useMyPool(true);
  if (isNil(myPool)) {
    return null;
  }

  return (
    <SummaryLayout>
      <SummaryItem title="My Pool">#{myPool?.poolId}</SummaryItem>
      <BondedItem bonded={myPool?.points} />
      <ClaimableItem claimable={myPool?.claimable} />
    </SummaryLayout>
  );
}
