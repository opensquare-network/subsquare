import { withCommonProps } from "next-common/lib";
import { createStore } from "next-common/store";
import ChainProvider, { useChainSettings } from "next-common/context/chain";
import ApiProvider from "next-common/context/api";
import { Provider } from "react-redux";
import { commonReducers } from "next-common/store/reducers";
import { CHAIN } from "next-common/utils/constants";
import getChainSettings from "next-common/utils/consts/settings";
import RelayInfoProvider from "next-common/context/relayInfo";
import BaseLayout from "next-common/components/layout/baseLayout";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import NoWalletConnected from "next-common/components/assets/noWalletConnected";
import { SecondaryCardDetail } from "next-common/components/styled/containers/secondaryCard";
import { AccountImpl } from "next-common/components/layout/AccountLayout";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import Tabs from "next-common/components/tabs";
import { useState } from "react";
import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import PrimaryButton from "next-common/lib/button/primary";
const isPeopleSupported = !!getChainSettings(CHAIN).modules?.people;

let chain;
let store;

if (isPeopleSupported) {
  chain = `${CHAIN}-people`;
  store = createStore({
    chain,
    reducer: commonReducers,
  });
}

export default function PeoplePage() {
  if (!isPeopleSupported) {
    return null;
  }

  return (
    <RelayInfoProvider>
      <Provider store={store}>
        <ChainProvider chain={chain}>
          <ApiProvider>
            <PeopleOverviewPageImpl />
          </ApiProvider>
        </ChainProvider>
      </Provider>
    </RelayInfoProvider>
  );
}

function PeopleOverviewPageImpl() {
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
  const [activeTabValue, setActiveTabValue] = useState("direct-identity");

  const tabs = [
    {
      value: "direct-identity",
      label: "Direct Identity",
      content: (
        <div className="space-y-4">
          <GreyPanel className="px-4 py-2.5 text14Medium text-textSecondary">
            No identity is set for the connected account.
          </GreyPanel>
          <PrimaryButton className="w-auto">Set Identity</PrimaryButton>
        </div>
      ),
    },
    {
      value: "sub-identities",
      label: "Sub Identities",
      content: <div>Sub Identities</div>,
    },
  ];

  function handleTabClick(tab) {
    setActiveTabValue(tab.value);
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

export const getServerSideProps = async (ctx) => {
  if (!isPeopleSupported) {
    return {
      notFound: true,
    };
  }

  return withCommonProps(async () => {
    return {
      props: {},
    };
  })(ctx);
};
