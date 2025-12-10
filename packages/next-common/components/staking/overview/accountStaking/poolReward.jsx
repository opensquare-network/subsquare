import { useMyPoolRewardContext } from "next-common/context/staking/poolReward";
import { AccountBalanceItem } from "next-common/components/overview/accountInfo/components/accountBalances";
import ClaimPoolRewardButton from "./claimRewardButton";
import CompoundPoolRewardButton from "./compoundRewardButton";

export default function PoolReward() {
  const { claimable, loading } = useMyPoolRewardContext();

  if (loading && claimable === 0n) {
    return null;
  }

  return (
    <div className="flex sm:items-center max-sm:flex-col">
      <AccountBalanceItem
        title="Unclaimed Rewards"
        value={(claimable || 0n)?.toString()}
        isLoading={loading}
      />
      <div className="flex gap-4 max-sm:justify-end">
        <ClaimPoolRewardButton />
        <CompoundPoolRewardButton />
      </div>
    </div>
  );
}
