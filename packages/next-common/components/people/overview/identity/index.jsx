import { SecondaryCardDetail } from "next-common/components/styled/containers/secondaryCard";
import Tabs from "next-common/components/tabs";
import DirectIdentityImpl from "./directIdentity";
import { useIdentityInfoContext } from "next-common/context/people/identityInfoContext";
import { useState } from "react";

export default function PeopleOverviewIdentity() {
  const [activeTabValue, setActiveTabValue] = useState("direct-identity");
  const { info: subMyIdentityInfo, isLoading } = useIdentityInfoContext();

  const isEmpty =
    Object.values(subMyIdentityInfo ?? {}).filter(Boolean).length === 0;

  const tabs = [
    {
      value: "direct-identity",
      label: "Direct Identity",
      content: (
        <DirectIdentityImpl
          isEmpty={isEmpty}
          identityInfo={subMyIdentityInfo}
          isLoading={isLoading}
        />
      ),
    },
    // {
    //   value: "sub-identities",
    //   label: "Sub Identities",
    //   content: <SubIdentitiesImpl isEmpty={isEmpty} />,
    // },
  ];

  const handleTabClick = (tab) => {
    setActiveTabValue(tab.value);
  };

  return (
    <SecondaryCardDetail>
      <Tabs
        activeTabValue={activeTabValue}
        onTabClick={handleTabClick}
        tabs={tabs}
      />
    </SecondaryCardDetail>
  );
}
