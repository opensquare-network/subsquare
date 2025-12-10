// import ValueDisplay from "next-common/components/valueDisplay";
// import { useChainSettings } from "next-common/context/chain";
// import ClaimPoolRewardButton from "./claimRewardButton";
import { useMyPoolRewardContext } from "next-common/context/staking/poolReward";
// import { toPrecision } from "next-common/utils";
import { AccountBalanceItem } from "next-common/components/overview/accountInfo/components/accountBalances";
import ClaimPoolRewardButton from "./claimRewardButton";
import CompoundPoolRewardButton from "./compoundRewardButton";
// import LoadableContent from "next-common/components/common/loadableContent";

export default function PoolReward() {
  // const { decimals, symbol } = useChainSettings();
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
