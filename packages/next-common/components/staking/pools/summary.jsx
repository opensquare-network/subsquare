import { isNil } from "lodash-es";
import SummaryLayout from "next-common/components/summary/layout/layout";
import ClaimableItem from "./claimableItem";
import BondedItem from "./bondedItem";
import WithdrawItem from "./withdrawItem";
import PoolIdItem from "./poolIdItem";

export default function PoolsSummary({ myPool }) {
  if (isNil(myPool)) {
    return null;
  }

  return (
    <SummaryLayout>
      <PoolIdItem poolId={myPool?.poolId} />
      <BondedItem bonded={myPool?.points} />
      <ClaimableItem claimable={myPool?.claimable} />
      <WithdrawItem unbondingEras={myPool?.unbondingEras} />
    </SummaryLayout>
  );
}
