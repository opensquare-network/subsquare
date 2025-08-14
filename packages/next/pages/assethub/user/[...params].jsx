import ProfileAssets from "next-common/components/profile/assets";
import ProfileForeignAssets from "next-common/components/profile/foreignAssets";
import Bio from "next-common/components/profile/bio";
import { useProfileAssetHubTabs } from "next-common/components/profile/tabs/useProfileAssetHubTabs";
import ApiProvider from "next-common/context/api";
import ChainProvider from "next-common/context/chain";
import { createStore } from "next-common/store";
import { commonReducers } from "next-common/store/reducers";
import multiAccountsSlice from "next-common/store/reducers/multiAccountsSlice";
import { CHAIN } from "next-common/utils/constants";
import getChainSettings from "next-common/utils/consts/settings";
import { Provider } from "react-redux";
import ProfileHeaderWithBanner from "next-common/components/profile/header";
import ProfileLayout from "next-common/components/layout/ProfileLayout";
import { ConditionRelayInfoProvider } from "../";
import ProfileUserInfoProvider from "next-common/components/profile/header/context/profileUserInfoContext";

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
    <ConditionRelayInfoProvider>
      <Provider store={store}>
        <ChainProvider chain={chain}>
          <ApiProvider>
            <ProfileUserInfoProvider>
              <AssetHubUserPageImpl />
            </ProfileUserInfoProvider>
          </ApiProvider>
        </ChainProvider>
      </Provider>
    </ConditionRelayInfoProvider>
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
      <div className="flex flex-col gap-[16px]">
        <ProfileAssets />
        <ProfileForeignAssets />
      </div>
    </ProfileLayout>
  );
}
