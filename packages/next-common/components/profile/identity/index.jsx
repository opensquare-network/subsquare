import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import Tabs from "next-common/components/tabs";
import ProfileIdentityTimeline from "../identityTimeline";
import { MemoizedPeopleApiContext } from "next-common/context/people/api";
import { useState } from "react";
import DirectIdentity from "./directIentity";

export default function ProfileIdentity() {
  const [activeTabValue, setActiveTabValue] = useState("direct-identity");
  const tabs = [
    {
      value: "direct-identity",
      label: "Direct Identity",
      content: (
        <DirectIdentity isEmpty={false} identityInfo={{}} isLoading={false} />
      ),
    },
    {
      value: "timeline",
      label: "Timeline",
      content: <ProfileIdentityTimeline />,
    },
  ];
  return (
    <MemoizedPeopleApiContext>
      <SecondaryCard>
        <Tabs
          tabs={tabs}
          activeTabValue={activeTabValue}
          onTabClick={(tab) => setActiveTabValue(tab.value)}
        />
      </SecondaryCard>
    </MemoizedPeopleApiContext>
  );
}
