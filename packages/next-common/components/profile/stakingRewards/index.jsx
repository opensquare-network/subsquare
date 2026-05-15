import useProfileAddress from "next-common/components/profile/useProfileAddress";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import StakingRewardsList from "next-common/components/profile/transfers/stakingRewards";

export default function ProfileStakingRewards() {
  const address = useProfileAddress();
  return (
    <SecondaryCard>
      <StakingRewardsList address={address} />
    </SecondaryCard>
  );
}
