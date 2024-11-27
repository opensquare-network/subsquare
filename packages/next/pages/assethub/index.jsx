import { AssetMetadataProvider } from "next-common/components/assets/context/assetMetadata";
import NoWalletConnected from "next-common/components/assets/noWalletConnected";
import ListLayout from "next-common/components/layout/ListLayout";
import ApiProvider from "next-common/context/api";
import ChainProvider, { useChainSettings } from "next-common/context/chain";
import RelayInfoProvider from "next-common/context/relayInfo";
import { withCommonProps } from "next-common/lib";
import { createStore } from "next-common/store";
import { commonReducers } from "next-common/store/reducers";
import { CHAIN } from "next-common/utils/constants";
import getChainSettings from "next-common/utils/consts/settings";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { Provider } from "react-redux";

const isAssetHubSupported = !!getChainSettings(CHAIN).modules?.assethub;

let chain;
let store;

if (isAssetHubSupported) {
  chain = `${CHAIN}-assethub`;
  store = createStore({
    chain,
    reducer: commonReducers,
  });
}

export default function AssetHubPage() {
  return (
    <RelayInfoProvider>
      <AssetMetadataProvider>
        <Provider store={store}>
          <ChainProvider chain={chain}>
            <ApiProvider>
              <AssetHubOverviewPageImpl />
            </ApiProvider>
          </ChainProvider>
        </Provider>
      </AssetMetadataProvider>
    </RelayInfoProvider>
  );
}

function AssetHubOverviewPageImpl() {
  const { description } = useChainSettings();
  const realAddress = useRealAddress();

  if (!realAddress) {
    return <NoWalletConnected />;
  }

  return (
    <ListLayout title="Asset Hub" description={description}>
      <div className="space-y-6">
        <div>Asset Hub page</div>
      </div>
    </ListLayout>
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
