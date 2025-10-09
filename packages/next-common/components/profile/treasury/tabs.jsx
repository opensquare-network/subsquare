import { useState } from "react";
import ProfileTreasuryCommonTable from "./commonTable";
import Tabs from "next-common/components/tabs";
import { usePageProps } from "next-common/context/page";

export default function ProfileTreasuryTabs() {
  const { beneficiariesSummary } = usePageProps();
  const [activeTabValue, setActiveTabValue] = useState("spends");
  const { spends, proposals, bounties, childBounties, tips } =
    beneficiariesSummary ?? {};

  const tabs = [
    {
      value: "spends",
      label: "Spends",
      content: <ProfileTreasuryCommonTable type="spends" />,
      activeCount: spends?.benefitCount || 0,
    },
    {
      value: "proposals",
      label: "Proposals",
      content: <ProfileTreasuryCommonTable type="proposals" />,
      activeCount: proposals?.benefitCount || 0,
    },
    {
      value: "tips",
      label: "Tips",
      content: <ProfileTreasuryCommonTable type="tips" />,
      activeCount: tips?.benefitCount || 0,
    },
    {
      value: "bounties",
      label: "Bounties",
      content: <ProfileTreasuryCommonTable type="bounties" />,
      activeCount: bounties?.benefitCount || 0,
    },
    {
      value: "child-bounties",
      label: "Child Bounties",
      content: <ProfileTreasuryCommonTable type="child-bounties" />,
      activeCount: childBounties?.benefitCount || 0,
    },
  ];

  return (
    <Tabs
      tabs={tabs}
      activeTabValue={activeTabValue}
      onTabClick={(tab) => setActiveTabValue(tab.value)}
    />
  );
}
