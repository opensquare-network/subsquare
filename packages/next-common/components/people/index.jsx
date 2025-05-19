import { useChainSettings } from "next-common/context/chain";
import BaseLayout from "next-common/components/layout/baseLayout";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import NoWalletConnected from "next-common/components/assets/noWalletConnected";
import { AccountImpl } from "next-common/components/layout/AccountLayout";
import usePeopleOverviewTabs from "./overview/hooks/usePeopleOverviewTabs";
import Tabs from "next-common/components/tabs";
import useTabNavigation from "./overview/hooks/useTabNavigation";
import RegistrarProvider from "next-common/context/people/registrarContext";
import PeopleCommonProvider from "./common/commonProvider";
import UserAccountProvider from "next-common/context/user/account";

export default function PeopleOverviewPageImpl() {
  const { description } = useChainSettings();
  const realAddress = useRealAddress();

  if (!realAddress) {
    return <NoWalletConnected />;
  }
  return (
    <PeopleCommonProvider>
      <BaseLayout title="Identities" description={description}>
        <PeopleOverviewContent />
      </BaseLayout>
    </PeopleCommonProvider>
  );
}

function PeopleOverviewContent() {
  const realAddress = useRealAddress();
  const tabs = usePeopleOverviewTabs();
  const { activeTabValue, handleTabClick } = useTabNavigation();

  return (
    <div className="space-y-6">
      <UserAccountProvider address={realAddress}>
        <RegistrarProvider>
          <AccountImpl>
            <Tabs
              tabs={tabs}
              activeTabValue={activeTabValue}
              onTabClick={handleTabClick}
              tabsListDivider={false}
              tabsListClassName="px-6"
            />
          </AccountImpl>
        </RegistrarProvider>
      </UserAccountProvider>
    </div>
  );
}
