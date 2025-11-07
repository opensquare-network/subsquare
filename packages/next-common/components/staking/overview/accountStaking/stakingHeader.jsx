import { isNil } from "lodash-es";
import { AddressUser } from "next-common/components/user";
import { useMyPool } from "next-common/hooks/staking/useMyPool";
import { usePoolAccounts } from "next-common/hooks/staking/usePoolAccount";
import { usePoolMetadata } from "next-common/hooks/staking/usePoolMetadata";
import { cn } from "next-common/utils";

function PoolAccount({ poolId }) {
  const { stash, reward } = usePoolAccounts(poolId);
  const { metadata } = usePoolMetadata(poolId);

  return (
    <div className="flex gap-[12px]">
      <div className="flex flex-col">
        <span>{metadata}</span>
        <div className="flex gap-3">
          <AddressUser add={stash} className="text12Medium" />
          <AddressUser add={reward} className="text12Medium" />
        </div>
      </div>
    </div>
  );
}

export default function StakingHeader({ width }) {
  const { myPool, loading } = useMyPool();

  if (loading || isNil(myPool)) {
    return null;
  }

  const poolId = myPool.poolId;

  return (
    <div className="flex flex-col gap-2">
      <div
        className={cn(
          "flex justify-between items-start grow gap-4",
          width > 768 ? "flex-row" : "flex-col",
        )}
      >
        <div className="flex flex-col gap-2">
          <PoolAccount poolId={poolId} />
        </div>
        <div className="flex gap-[16px] items-center"></div>
      </div>
    </div>
  );
}
