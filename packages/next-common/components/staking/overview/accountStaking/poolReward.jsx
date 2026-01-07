import { useMyPoolRewardContext } from "next-common/context/staking/poolReward";
import ClaimPoolRewardButton from "./claimRewardButton";
import CompoundPoolRewardButton from "./compoundRewardButton";
import RewardPanel from "../rewardPanel";

export default function PoolReward() {
  const { claimable, loading } = useMyPoolRewardContext();
  if (loading && claimable === 0n) {
    return null;
  }

  return (
    <RewardPanel value={(claimable || 0n)?.toString()} isLoading={loading}>
      <ClaimPoolRewardButton />
      <CompoundPoolRewardButton />
    </RewardPanel>
  );
}
