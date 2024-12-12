import { AssetMetadataProvider } from "next-common/components/assets/context/assetMetadata";
import NoWalletConnected from "next-common/components/assets/noWalletConnected";
import WalletAssetList from "next-common/components/assets/walletAssetList";
import ApiProvider from "next-common/context/api";
import ChainProvider from "next-common/context/chain";
import { RelayChainApiProvider } from "next-common/context/relayChain";
import RelayInfoProvider from "next-common/context/relayInfo";
import { withCommonProps } from "next-common/lib";
import { createStore } from "next-common/store";
import { commonReducers } from "next-common/store/reducers";
import { CHAIN } from "next-common/utils/constants";
import getChainSettings from "next-common/utils/consts/settings";
import useExistentialDeposit from "next-common/utils/hooks/chain/useExistentialDeposit";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
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

export default function AssetHubPage() {
  return (
    <RelayInfoProvider>
      <Provider store={store}>
        <ChainProvider chain={chain}>
          <ApiProvider>
            <AssetHubOverviewPageImpl />
          </ApiProvider>
        </ChainProvider>
      </Provider>
    </RelayInfoProvider>
  );
}

function AssetHubOverviewPageImpl() {
  const realAddress = useRealAddress();
  useExistentialDeposit();

  if (!realAddress) {
    return <NoWalletConnected />;
  }

  return (
    <AssetMetadataProvider>
      <RelayChainApiProvider>
        <WalletAssetList />
      </RelayChainApiProvider>
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
