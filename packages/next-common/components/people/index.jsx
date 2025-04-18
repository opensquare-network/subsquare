import { useState } from "react";
import { useChainSettings } from "next-common/context/chain";
import BaseLayout from "next-common/components/layout/baseLayout";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import NoWalletConnected from "next-common/components/assets/noWalletConnected";
import { SecondaryCardDetail } from "next-common/components/styled/containers/secondaryCard";
import { AccountImpl } from "next-common/components/layout/AccountLayout";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import Tabs from "next-common/components/tabs";
import DirectIdentityImpl from "./overview/directIdentity";
import SubIdentitiesImpl from "./overview/subIdentities";
import { useRouter } from "next/router";
export default function PeopleOverviewPageImpl() {
  const { description } = useChainSettings();
  const realAddress = useRealAddress();

  if (!realAddress) {
    return <NoWalletConnected />;
  }
  return (
    <BaseLayout title="Identities" description={description}>
      <PeopleOverviewContent />
    </BaseLayout>
  );
}

function PeopleOverviewContent() {
  const router = useRouter();
  const [activeTabValue, setActiveTabValue] = useState(
    router.query.tab || "direct-identity",
  );
  const tabs = [
    {
      value: "direct-identity",
      label: "Direct Identity",
      content: <DirectIdentityImpl />,
    },
    {
      value: "sub-identities",
      label: "Sub Identities",
      content: <SubIdentitiesImpl />,
    },
  ];

  function handleTabClick(tab) {
    setActiveTabValue(tab.value);
    router.replace(
      {
        query: {
          tab: tab.value,
        },
      },
      null,
      { shallow: true },
    );
  }

  return (
    <div className="space-y-6">
      <AccountImpl>
        <TitleContainer className="mb-4">Identity</TitleContainer>
        <SecondaryCardDetail>
          <Tabs
            activeTabValue={activeTabValue}
            onTabClick={handleTabClick}
            tabs={tabs}
          />
        </SecondaryCardDetail>
      </AccountImpl>
    </div>
  );
}
