import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import Tabs from "next-common/components/tabs";
import PeopleApiProvider from "next-common/context/people/api";
import { useState, useMemo } from "react";
import useProfileAddress from "next-common/components/profile/useProfileAddress";
import { useIdentityOf } from "next-common/hooks/identity/useIdentityOf";
import { usePeopleApi } from "next-common/context/people/api";
import dynamicClientOnly from "next-common/lib/dynamic/clientOnly";

const DirectIdentity = dynamicClientOnly(() => import("./directIentity"));
const Judgements = dynamicClientOnly(() => import("./judgements"));
const SubIdentities = dynamicClientOnly(() => import("./subIdentities"));
const ProfileIdentityTimeline = dynamicClientOnly(() =>
  import("../identityTimeline"),
);

function ProfileIdentityImpl() {
  const [activeTabValue, setActiveTabValue] = useState("direct-identity");
  const api = usePeopleApi();
  const address = useProfileAddress();

  const { info, judgements, isLoading } = useIdentityOf(api, address);

  const tabs = useMemo(
    () => [
      {
        value: "direct-identity",
        label: "Direct Identity",
        content: <DirectIdentity identityInfo={info} isLoading={isLoading} />,
      },
      {
        value: "sub-identities",
        label: "Sub Identities",
        content: <SubIdentities />,
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
    ],
    [info, judgements, isLoading],
  );

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
    <PeopleApiProvider>
      <SecondaryCard>
        <ProfileIdentityImpl />
      </SecondaryCard>
    </PeopleApiProvider>
  );
}
