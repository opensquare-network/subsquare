import { isNil } from "lodash-es";
import Avatar from "next-common/components/avatar";
import Copyable from "next-common/components/copyable";
import { AddressUser } from "next-common/components/user";
import { useMyPool } from "next-common/hooks/staking/useMyPool";
import { usePoolAccounts } from "next-common/hooks/staking/usePoolAccount";
import { addressEllipsis, cn } from "next-common/utils";

const DisplayUserAvatar = ({ address }) => {
  return <Avatar address={address} size={40} />;
};

const DisplayUser = ({ address }) => {
  return (
    <AddressUser
      add={address}
      showAvatar={false}
      className="text14Medium text-textPrimary"
    />
  );
};

function PoolAccount({ poolId }) {
  const { stash } = usePoolAccounts(poolId);

  return (
    <div className="flex gap-[12px]">
      <DisplayUserAvatar address={stash} />
      <div className="flex flex-col">
        <DisplayUser address={stash} />
        <Copyable className="max-md:hidden text-textTertiary text14Medium inline-flex items-center">
          {stash}
        </Copyable>
        <Copyable
          className="md:hidden text-textTertiary text14Medium"
          copyText={stash}
        >
          {addressEllipsis(stash)}
        </Copyable>
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
