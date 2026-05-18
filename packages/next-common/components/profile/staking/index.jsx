import { useState } from "react";
import useProfileAddress from "next-common/components/profile/useProfileAddress";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import StakingRewardsList from "./stakingRewards";
import StakingNominationsList from "./nominations";
import Tabs from "next-common/components/tabs";

function RewardsContent({ address }) {
  return (
    <SecondaryCard>
      <StakingRewardsList address={address} />
    </SecondaryCard>
  );
}

function NominationsContent({ address }) {
  return (
    <SecondaryCard>
      <StakingNominationsList address={address} />
    </SecondaryCard>
  );
}

export default function ProfileStaking() {
  const address = useProfileAddress();
  const [activeTab, setActiveTab] = useState("rewards");

  const tabs = [
    {
      value: "rewards",
      label({ active }) {
        return (
          <span
            className={`cursor-pointer text16Bold ${
              active ? "text-textPrimary" : "text-textTertiary"
            }`}
          >
            Rewards
          </span>
        );
      },
      content: <RewardsContent address={address} />,
    },
    {
      value: "nominations",
      label({ active }) {
        return (
          <span
            className={`cursor-pointer text16Bold ${
              active ? "text-textPrimary" : "text-textTertiary"
            }`}
          >
            Nominations
          </span>
        );
      },
      content: <NominationsContent address={address} />,
    },
  ];

  return (
    <Tabs
      activeTabValue={activeTab}
      onTabClick={(tab) => setActiveTab(tab.value)}
      tabs={tabs}
      tabsListDivider={false}
      tabsListClassName="ml-6 mb-4"
    />
  );
}
