import { SecondaryCardDetail } from "next-common/components/styled/containers/secondaryCard";
import Tabs from "next-common/components/tabs";
import DirectIdentityImpl from "./directIdentity";
import { useIdentityInfoContext } from "next-common/context/people/identityInfoContext";
import SubIdentitiesImpl from "./subIdentities";
import { useState } from "react";
import { isIdentityEmpty } from "next-common/components/people/common";

export default function PeopleOverviewIdentity() {
  const [activeTabValue, setActiveTabValue] = useState("direct-identity");
  const { info: subMyIdentityInfo, isLoading } = useIdentityInfoContext();

  const isEmpty = isIdentityEmpty(subMyIdentityInfo);

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
    {
      value: "sub-identities",
      label: "Sub Identities",
      content:
        activeTabValue === "sub-identities" ? (
          <SubIdentitiesImpl isEmpty={isEmpty} isLoading={isLoading} />
        ) : null,
    },
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
