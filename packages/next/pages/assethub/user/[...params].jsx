import ProfileAssets from "next-common/components/profile/assets";
import Bio from "next-common/components/profile/bio";
import ProfileBreadcrumbs from "next-common/components/profile/breadcrumbs";
import { useProfileAssetHubTabs } from "next-common/components/profile/tabs/useProfileAssetHubTabs";
import ApiProvider from "next-common/context/api";
import ChainProvider from "next-common/context/chain";
import RelayInfoProvider from "next-common/context/relayInfo";
import { createStore } from "next-common/store";
import { commonReducers } from "next-common/store/reducers";
import multiAccountsSlice from "next-common/store/reducers/multiAccountsSlice";
import { CHAIN } from "next-common/utils/constants";
import getChainSettings from "next-common/utils/consts/settings";
import { Provider } from "react-redux";
import ProfileHeaderWithBanner from "next-common/components/profile/header";
import ProfileLayout from "next-common/components/layout/ProfileLayout";

const isAssetHubSupported = !!getChainSettings(CHAIN).modules?.assethub;

let chain;
let store;

if (isAssetHubSupported) {
  chain = `${CHAIN}-assethub`;
  store = createStore({
    chain,
    reducer: {
      ...commonReducers,
      multiAccounts: multiAccountsSlice,
    },
  });
}

export { getServerSideProps } from "../../user/[...params]";

export default function AssetHubUserPage() {
  return (
    <RelayInfoProvider>
      <Provider store={store}>
        <ChainProvider chain={chain}>
          <ApiProvider>
            <AssetHubUserPageImpl />
          </ApiProvider>
        </ChainProvider>
      </Provider>
    </RelayInfoProvider>
  );
}

function AssetHubUserPageImpl() {
  const tabs = useProfileAssetHubTabs();

  return (
    <ProfileLayout
      pageHeader={<ProfileHeaderWithBanner />}
      header={
        <>
          <Bio />
        </>
      }
      tabs={tabs}
    >
      <ProfileAssets />
    </ProfileLayout>
  );
}
