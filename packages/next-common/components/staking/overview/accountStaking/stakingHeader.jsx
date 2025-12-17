import { isNil } from "lodash-es";
import Avatar from "next-common/components/avatar";
import { AddressUser } from "next-common/components/user";
import { useMyPoolInfo } from "next-common/hooks/staking/useMyPool";
import { usePoolAccounts } from "next-common/hooks/staking/usePoolAccount";
import { usePoolMetadata } from "next-common/hooks/staking/usePoolMetadata";
import { cn } from "next-common/utils";
import { BondButton } from "./bondButton";
import { UnBondButton } from "./unbondButton";

function PoolAccount({ poolId }) {
  const { stash, reward } = usePoolAccounts(poolId);
  const { name } = usePoolMetadata(poolId);

  return (
    <div className="flex gap-[12px] text-textPrimary">
      <Avatar address={stash} size={40} />
      <div className="flex flex-col">
        <span>{name}</span>
        <div className="flex gap-2 ">
          <AddressUser
            showAvatar={false}
            add={stash}
            className="text12Medium"
          />
          <AddressUser
            showAvatar={false}
            add={reward}
            className="text12Medium"
          />
        </div>
      </div>
    </div>
  );
}

export default function StakingHeader({ width }) {
  const { myPool, loading } = useMyPoolInfo();

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
        <div className="flex gap-[16px] items-center">
          <BondButton poolId={poolId} />
          <UnBondButton poolId={poolId} />
        </div>
      </div>
    </div>
  );
}
