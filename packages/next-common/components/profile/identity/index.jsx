import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import Tabs from "next-common/components/tabs";
import ProfileIdentityTimeline from "../identityTimeline";
import { MemoizedPeopleApiContext } from "next-common/context/people/api";
import { useState } from "react";
import useProfileAddress from "next-common/components/profile/useProfileAddress";
import { useIdentityOf } from "next-common/hooks/identity/useIdentityOf";
import { usePeopleApi } from "next-common/context/people/api";
import DirectIdentity from "./directIentity";
import Judgements from "./judgements";

function ProfileIdentityImpl() {
  const [activeTabValue, setActiveTabValue] = useState("direct-identity");
  const api = usePeopleApi();
  const address = useProfileAddress();
  const { info, judgements, isLoading } = useIdentityOf(api, address);

  const tabs = [
    {
      value: "direct-identity",
      label: "Direct Identity",
      content: <DirectIdentity identityInfo={info} isLoading={isLoading} />,
    },
    {
      value: "judgements",
      label: "Judgements",
      content: <Judgements judgements={judgements} isLoading={isLoading} />,
    },
    {
      value: "timeline",
      label: "Timeline",
      content: <ProfileIdentityTimeline />,
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

export default function ProfileIdentity() {
  return (
    <MemoizedPeopleApiContext>
      <SecondaryCard>
        <ProfileIdentityImpl />
      </SecondaryCard>
    </MemoizedPeopleApiContext>
  );
}
