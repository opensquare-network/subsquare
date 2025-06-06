import AllAssetsList from "next-common/components/assets/allAssetsList";
import { AssetMetadataProvider } from "next-common/components/assets/context/assetMetadata";
import ApiProvider from "next-common/context/api";
import ChainProvider from "next-common/context/chain";
import { withCommonProps } from "next-common/lib";
import { createStore } from "next-common/store";
import { commonReducers } from "next-common/store/reducers";
import multiAccountsSlice from "next-common/store/reducers/multiAccountsSlice";
import { CHAIN } from "next-common/utils/constants";
import getChainSettings from "next-common/utils/consts/settings";
import { Provider } from "react-redux";
import { ConditionRelayInfoProvider } from "./";

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

export default function AssetHubAssetsPage() {
  return (
    <ConditionRelayInfoProvider>
      <Provider store={store}>
        <ChainProvider chain={chain}>
          <ApiProvider>
            <AssetHubAssetsPageImpl />
          </ApiProvider>
        </ChainProvider>
      </Provider>
    </ConditionRelayInfoProvider>
  );
}

function AssetHubAssetsPageImpl() {
  return (
    <AssetMetadataProvider>
      <AllAssetsList />
    </AssetMetadataProvider>
  );
}

export const getServerSideProps = async (ctx) => {
  if (!isAssetHubSupported) {
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
