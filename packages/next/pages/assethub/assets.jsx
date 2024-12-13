import AllAssetsList from "next-common/components/assets/allAssetsList";
import { AssetMetadataProvider } from "next-common/components/assets/context/assetMetadata";
import ApiProvider from "next-common/context/api";
import ChainProvider from "next-common/context/chain";
import RelayInfoProvider from "next-common/context/relayInfo";
import { withCommonProps } from "next-common/lib";
import { createStore } from "next-common/store";
import { commonReducers } from "next-common/store/reducers";
import { CHAIN } from "next-common/utils/constants";
import getChainSettings from "next-common/utils/consts/settings";
import { Provider } from "react-redux";

const isAssetHubSupported = !!getChainSettings(CHAIN).modules?.assethub;

let chain;
let store;

if (isAssetHubSupported) {
  chain = `${CHAIN}-assethub`;
  store = createStore({
    chain,
    reducer: {
      ...commonReducers,
    },
  });
}

export default function AssetHubAssetsPage() {
  return (
    <RelayInfoProvider>
      <Provider store={store}>
        <ChainProvider chain={chain}>
          <ApiProvider>
            <AssetHubAssetsPageImpl />
          </ApiProvider>
        </ChainProvider>
      </Provider>
    </RelayInfoProvider>
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
