import { useNominatorUnClaimedRewardsContext } from "./context/nominatorUnClaimedRewardsContext";
import ClaimNominatorRewardButton from "./quickActions/claimButton";
import RewardPanel from "../rewardPanel";

export default function NominatorReward() {
  const { result, loading, isUpdating } = useNominatorUnClaimedRewardsContext();
  const totalRewards = result?.totalRewards || "0";

  if (loading || isUpdating || totalRewards === "0") {
    return null;
  }

  return (
    <RewardPanel value={totalRewards} isLoading={loading}>
      <ClaimNominatorRewardButton />
    </RewardPanel>
  );
}
